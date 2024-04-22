createProfiles = () => {
    data = {
        "fullname": document.getElementById('fullname').value,
        "pin": document.getElementById('pin').value,
        "avatar": document.getElementById('AvatarUrl').value,
        "age": document.getElementById('age').value,
        "userId": document.getElementById('userId').value

    }
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://localhost:3001/api/profiles",
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
    console.log(data);
    renderProfiles(data.data.profiles);

}


renderProfiles = (profile) => {
    html = '';
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
    const deleteButtonStyle = `
        color: white;
        background-color: #9d1722;
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
    profile.forEach(element => {

    html += `
    <tr>
        <td>${element.fullname}</td>
        <td>${element.pin}</td>
        <td> <img src="${element.avatar}" alt="" width="100" height="100"> </td>
        <td>${element.age}</td>
        <td><button style="${editButtonStyle}" onclick="renderEditProfile('${element.id}','${element.fullname}','${element.pin}','${element.avatar}','${element.age}')" >Editar</button>
        <button style="${deleteButtonStyle}" onclick="deleteProfile('${element.id}')" >Eliminar</button></td>
    </tr>
`;

});
document.getElementById('tbodyPerfiles').innerHTML = html;

}


renderEditProfile = (id, name, pin, avatar, age) => {

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
    <script src="../public/js/avatars.js"></script>
            <input type="hidden" value="${id}" id="id" style="${inputStyle}">
            <input type="text" value="${name}" id="profileName" style="${inputStyle}">
            <input type="pin" value="${pin}" id="profilePin" style="${inputStyle}" maxlength="6" pattern="/^[0-9]{1,6}$/">
            <label for="avatarProfile">Avatar:</label>
            <input type="text" value="${avatar}" id="profileUrl" style="${inputStyle}">
            <input type="number" value="${age}" id="profileAge" style="${inputStyle}" min="1" step="1">

            <button style="${editButtonStyle}" type="button" onclick="updateProfile('${id}')"> Editar </button>
           
            `

    document.getElementById('paginacionPerfiles').innerHTML = html;

}
updateProfile = (id) => {
    data = {
        "fullname": document.getElementById('profileName').value,
        "pin": document.getElementById('profilePin').value,
        "avatar": document.getElementById('profileUrl').value,
        "age": document.getElementById('profileAge').value
    }

    console.log(data);
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": `http://localhost:3001/api/profiles?id=${id}`,
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

deleteProfile = (id) => {

    const settings = {
        "async": true,
        "crossDomain": true,
        "url": `http://localhost:3001/api/profiles?id=${id}`,
        "method": "DELETE"
    };

    $.ajax(settings).done(function (response) {
        console.log(response);
    });

    window.location.reload();

}