document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
    /Obtener el id del usuario jwt decode/
    const data = JSON.parse(atob(token.split('.')[1]));
    GetProfiles(data.userId);
    GetPlaylistByUser(data.userId);
    document.getElementById('userId').value = data.userId;
});
GetProfiles = async (id) => {
    let headersList = {
        "Content-Type": "application/json"
    }
    let gqlBody = {
        query: `
        query GetProfile($userId: ID!) {
            profiles(userId: $userId) {
                id fullname pin avatar age userId
            }
        }
    `,
        variables: { "userId": id }
    }
    let bodyContent = JSON.stringify(gqlBody);
    let response = await fetch("http://localhost:3002/graphql", {
        method: "POST",
        body: bodyContent,
        headers: headersList
    });
    let data = await response.json();
    //console.log(data);
    renderProfiles(data.data.profiles);
}
function renderProfiles(profiles) {
    const associatedProfilesDiv = document.getElementById('associatedProfiles');
    profiles.forEach(profile => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'associatedProfiles[]'; // Agregar corchetes para indicar que es un arreglo
        checkbox.value = profile.id; // Usar el userId en lugar del id del perfil
        checkbox.id = `profile-${profile.id}`; // ID único para cada checkbox

        const label = document.createElement('label');
        label.htmlFor = `profile-${profile.id}`;
        label.appendChild(document.createTextNode(profile.fullname));

        const profileDiv = document.createElement('div');
        profileDiv.appendChild(checkbox);
        profileDiv.appendChild(label);

        associatedProfilesDiv.appendChild(profileDiv);
    });
}
createPlaylist = () => {
    const associatedProfilesCheckboxes = document.querySelectorAll('input[name="associatedProfiles[]"]:checked');
    const associatedProfiles = Array.from(associatedProfilesCheckboxes).map(checkbox => checkbox.value);
    data = {
        "name": document.getElementById('name').value,
        "associatedProfiles": associatedProfiles,
        "userId": document.getElementById('userId').value
    }
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://localhost:3001/api/playlists",
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        },
        "processData": false,
        "data": JSON.stringify(data)
    };
    $.ajax(settings).done(function (response) {
        console.log(response);
    });

    window.location.reload();
}
GetPlaylistByUser = async (id) => {
    let headersList = {
        "Content-Type": "application/json"
    }

    let gqlBody = {
        query: `query {
           playlistByUser(userId: "${id}") {
               id
               name
               userId
               associatedProfiles {
                   id
                   fullname
                   pin
                   avatar
                   age
               }
               videos {
                   id
                   name
                   url
               }
           }
       }
       `,
    }
    let bodyContent = JSON.stringify(gqlBody);

    let response = await fetch("http://localhost:3002/graphql", {
        method: "POST",
        body: bodyContent,
        headers: headersList
    });
    let data = await response.json();
    renderPlaylists(data.data.playlistByUser);
}
function renderPlaylists(playlists) {
    const playlistList = document.getElementById('playlistList');
    playlistList.innerHTML = '';
    playlists.forEach(playlist => {
        const card = document.createElement('div');
        card.classList.add('card', 'mb-3');

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body', 'd-flex', 'justify-content-between', 'align-items-center');

        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = playlist.name;

        const badge = document.createElement('span');
        badge.classList.add('badge', 'badge-primary', 'badge-pill');
        badge.textContent = playlist.videos.length + ' videos';

        // Contenedor para los botones de editar y eliminar
        const buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add('d-flex');

        // Botón de editar
        const editButton = document.createElement('button');
        editButton.classList.add('btn', 'btn-primary', 'mr-2');
        editButton.textContent = 'Editar';
        editButton.addEventListener('click', () => {
            event.stopPropagation();
            // Lógica para editar la playlist
            renderEditPlaylist(playlist);
        });

        // Botón de eliminar
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', () => {
            event.stopPropagation();
            deletePlaylist(playlist.id);
        });

        buttonsContainer.appendChild(editButton);
        buttonsContainer.appendChild(deleteButton);

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(badge);
        cardBody.appendChild(buttonsContainer); // Agregar contenedor de botones
        card.appendChild(cardBody);
        playlistList.appendChild(card);

        card.addEventListener('click', () => {
            window.location.href = `managementVideo.html?playlistId=${playlist.id}`;
        });
    });
}
function renderEditPlaylist(playlist) {

    let html = '';
    const editButtonStyle = `
        color: white;
        background-color: #2b4e72;
        border: none;
        border-radius: 6px;
        padding: 5px 10px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-family: 'Montserrat', sans-serif;
        font-size: 14px;
        cursor: pointer;
    `;

    const inputStyle = `
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 6px 12px;
        font-size: 14px;
        font-family: 'Montserrat', sans-serif;
    `;

    html += `
    <label for="namePlaylist">Nombre de la playlist:</label>
    <input type="text" value="${playlist.name}" id="namePlaylist" style="${inputStyle}">
    <div id="associatedProfilesPlaylist">
    <label for="associatedProfilesPlaylist">Perfiles asociados:</label>
    `;

    playlist.associatedProfiles.forEach(profile => {
        html += `
            <div>
                <input type="checkbox" name="editPlaylistProfiles[]" value="${profile.id}" id="edit-profile-${profile.id}" checked>
                <label for="edit-profile-${profile.id}">${profile.fullname}</label>
            </div>
        `;
    });

    html += `
        </div>
        <button style="${editButtonStyle}" onclick="updatePlaylist('${playlist.id}'); return false;">Editar</button>
    `;

    document.getElementById('playlistRender').innerHTML = html;
}

function updatePlaylist(playlistId) {
    const name = document.getElementById('namePlaylist').value;
    const associatedEditProfilesCheckboxes = document.querySelectorAll('input[name="editPlaylistProfiles[]"]:checked');
    const associatedEditProfiles = Array.from(associatedEditProfilesCheckboxes).map(checkbox => checkbox.value);
    console.log(associatedEditProfilesCheckboxes);

    const data = {
        "name": name,
        "associatedProfiles": associatedEditProfiles
    }

    const settings = {
        "async": true,
        "crossDomain": true,
        "url": `http://localhost:3001/api/playlists?id=${playlistId}`,
        "method": "PUT",
        "headers": {
            "Content-Type": "application/json"
        },
        "processData": false,
        "data": JSON.stringify(data)
    };

    $.ajax(settings).done(function (response) {
        console.log(response);
    });

    window.location.reload();
}
function deletePlaylist(playlistId) {
    console.log(playlistId);
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": `http://localhost:3001/api/playlists?id=${playlistId}`,
        "method": "DELETE"
    };
    $.ajax(settings).done(function (response) {
        console.log(response);
    });
    window.location.reload();
}
