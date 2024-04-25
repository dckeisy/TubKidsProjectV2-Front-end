let IdProfile;

function getProfileIdFromQueryParam() {
    const urlParams = new URLSearchParams(window.location.search);
    IdProfile = urlParams.get('id');
    getVideo(IdProfile);
    return IdProfile;
}

getVideo = async (IdProfile) => {
    let headersList = {
        "Content-Type": "application/json"
    }

    let gqlBody = {
        query: `query {
         videosByProfile(idProfile: "${IdProfile}") {
           id
           name
           videos {
             id
             name
             url
             descripcion
             userId
           }
         }
       }
       `
    }

    let bodyContent = JSON.stringify(gqlBody);

    let response = await fetch("http://localhost:3002/graphql", {
        method: "POST",
        body: bodyContent,
        headers: headersList
    });

    let data = await response.json();
    console.log(data);
    renderVideo(data.data.videosByProfile);
}
renderVideo = (playlist) => {
    let html = '';
    if (playlist && playlist.length > 0) {
        playlist.forEach(playlistGroup => {
            html += `<h2> Playlist ${playlistGroup.name}</h2>`;
            playlistGroup.videos.forEach(video => {
                html += `
        <div class="grid-videos">
            <a href="${video.url}&controls=0" class="video">${video.name}</a>
            <a href="${video.url}&controls=0" class="descripcion">${video.descripcion}</a>
            <iframe src="${video.url}" frameborder="0"></iframe>
        </div>
        `;
            });
        });
    }
    document.getElementById('video').innerHTML = html;
}
getVideoBySearch = async () => {
    console.log(IdProfile);
    const searchText = document.getElementById('search').value;
    let headersList = {
        "Content-Type": "application/json"
    }

    let gqlBody = {
        query: `query {
         searchVideos(idProfile: "${IdProfile}",searchText: "${searchText}"){
             id
             name
             url
             descripcion
             userId
         }
       }`,
    }

    let bodyContent = JSON.stringify(gqlBody);

    let response = await fetch("http://localhost:3002/graphql", {
        method: "POST",
        body: bodyContent,
        headers: headersList
    });

    let data = await response.json();
    renderVideoSearch(data.data.searchVideos);
}
renderVideoSearch = (videos) => {
    console.log(videos);
    const html = videos.map(video => `
    <div class="grid-videos">
        <a href="${video.url}&controls=0" class="video">${video.name}</a>
        <a href="${video.url}&controls=0" class="descripcion">${video.descripcion}</a>
        <iframe src="${video.url}" frameborder="0"></iframe>
    </div>
    `).join('');

    document.getElementById('video').innerHTML = html;
}
