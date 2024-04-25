const loginButton = document.querySelector('.login-button');
loginButton.addEventListener('click', () => {
    window.location.href = 'login.html';
});

saveUser = () => {
    userStatus = "pendiente";
    let data = {
        "username": document.getElementById('username').value,
        "lastname": document.getElementById('lastname').value,
        "dateOfBirth": document.getElementById('datebirth').value,
        "password": document.getElementById('password').value,
        "confirmPassword": document.getElementById('confirmPassword').value,
        "email": document.getElementById('email').value,
        "pin": document.getElementById('pin').value,
        "country": document.getElementById('country').value,
        "phone": document.getElementById('countryCode').value + document.getElementById('phone').value,
        "status": userStatus
    }
    let settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://localhost:3001/api/users",
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        },
        "processData": false,
        "data": JSON.stringify(data)
    };

    $.ajax(settings).done(function (response) {
        console.log(response);
        alert("¡Registro exitoso!");
        window.location.href = 'register.html';
    }).fail(function (error) {
        console.log(error);
        alert("No se pudo registrar los datos. Por favor, verifique la información ingresada.");
        window.location.href = 'register.html';
    });
}