let playlistId;

function getPlaylistIdFromQueryParam() {
    const urlParams = new URLSearchParams(window.location.search);
    playlistId = urlParams.get('playlistId');
    GetVideosByPlaylist(playlistId);
    return playlistId;
}
/*---------------------------------------------------------------------------------------------*/
createVideo = () => {

    data = {
        "name": document.getElementById('titleVideo').value,
        "url": document.getElementById('urlVideo').value,
        "descripcion": document.getElementById('videoDescription').value,
        "userId": document.getElementById('userId').value,
        "playlistId": playlistId
    }
    
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://localhost:3001/api/videos",
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
/*---------------------------------------------------------------------------------------------*/
GetVideosByPlaylist = async (IdPlaylist) => {
    //console.log(IdPlaylist);
    let headersList = {
        "Content-Type": "application/json"
    }

    let gqlBody = {
        query: `query {
            videosByPlaylist(id: "${IdPlaylist}") {
               videos {
                   id
                   name
                   url
                   userId
               }
           }
       }`
    }

    let bodyContent = JSON.stringify(gqlBody);
    let response = await fetch("http://localhost:3002/graphql", {
        method: "POST",
        body: bodyContent,
        headers: headersList
    });

    let data = await response.json();
    renderVideo(data.data.videosByPlaylist);

}
renderVideo = (videos) => {
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
    if (videos && videos.length > 0) {
        videos.forEach(videoGroup => {
            // Iterar sobre cada objeto de video dentro del arreglo de videos
            videoGroup.videos.forEach(video => {
                html += `<tr>
                            <td>${video.name}</td>
                            <td>${video.url}</td>
                            <td>
                                <button style="${editButtonStyle}" onclick="renderEdit('${video.name}','${video.url}','${video.id}')" >Editar</button>
                                <button style="${deleteButtonStyle}" onclick="DeleteVideo('${video.id}')" >Eliminar</button>
                            </td>
                        </tr>`;
            });
        });
    }
    document.getElementById('tbody').innerHTML = html;
}
/*---------------------------------------------------------------------------------------------*/
DeleteVideo = (id) => {

    const settings = {
        "async": true,
        "crossDomain": true,
        "url": `http://localhost:3001/api/videos?id=${id}`,
        "method": "DELETE"
    };

    $.ajax(settings).done(function (response) {
        console.log(response);
    });
    window.location.reload();

}
/*---------------------------------------------------------------------------------------------*/
renderEdit = (name, url, id) => {
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
            <input type="text" value="${name}" id="name" style="${inputStyle}">
            <input type="text" value="${url}" id="url" style="${inputStyle}">  
            <button style="${editButtonStyle}" onclick="updateVideo('${id}');return false" >Editar</button>    
            `
    document.getElementById('paginacionVideos').innerHTML = html;


}
/*---------------------------------------------------------------------------------------------*/
updateVideo = (id) => {
    data = {
        "name": document.getElementById('name').value,
        "url": document.getElementById('url').value
    }

    const settings = {
        "async": true,
        "crossDomain": true,
        "url": `http://localhost:3001/api/videos?id=${id}`,
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

