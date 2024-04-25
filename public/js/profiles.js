document.addEventListener('DOMContentLoaded', function () {
  const token = localStorage.getItem('token');
  /*Obtener el id del usuario jwt decode*/
  const data = JSON.parse(atob(token.split('.')[1]));
  GetProfiles(data.userId);
});
verifyPin = () => {
  const pin = prompt('Ingrese su PIN:');

  const token = localStorage.getItem('token');
  /*Obtener el id del usuario jwt decode*/
  const tokens = JSON.parse(atob(token.split('.')[1]));

  let getOneUrl = `http://localhost:3001/api/users/${tokens.userId}`;

  const settings = {
    "async": true,
    "crossDomain": true,
    "url": getOneUrl,
    "method": "GET"
  };

  $.ajax(settings).done(function (response) {
    console.log(response);
    let pinuser = ''
    response.forEach(res => {
      pinuser = res.pin
    })

    if (pin == pinuser) {
      window.location.href = '../admin/admin.html';
    } else {
      alert('Pin incorrecto');
    }

  });
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
  renderKids(data.data.profiles);
}




renderKids = (profiles) => {
  html = '';
  profiles.forEach(element => {
    html += `
    <div class="image-wrapper">
      <img class="image-item" onclick="verifykids('${element.pin}','${element.id}')" src="${element.avatar}" alt="${element.fullname}"/>
      <span class="fullname">${element.fullname}</span>
    </div>
      `
  })
  document.getElementById('avatarImg').innerHTML = html;

}
verifykids = (pins,id) => {

  const pin = prompt('Ingrese su PIN:');
  if (pin == pins) {
    window.location.href = `../user/videos.html?id=${id}`;
  }else{
    alert('Pin incorrecto'); 
  }
}