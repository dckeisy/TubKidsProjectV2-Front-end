
VerifyUser = () => {

    const ajaxRequest = new XMLHttpRequest();
    ajaxRequest.addEventListener("load", function () {
        // Handle the response here
        if (ajaxRequest.status >= 200 && ajaxRequest.status < 300) {
            const data = JSON.parse(ajaxRequest.responseText);
            if (data.token) {
                // Guardar el token en localStorage
                localStorage.setItem('token', data.token);
                console.log('Token guardado en localStorage');
                window.location.href = 'profiles.html';
            } else {
                console.error('Error de autenticación:', data.message);
            }

        } else {
           
        }
    });
    ajaxRequest.addEventListener("error", function (e) {console.log(e)});
    ajaxRequest.open("POST", "http://localhost:3001/api/login");
    ajaxRequest.setRequestHeader("Content-Type", "application/json");

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;


    let dataset = JSON.stringify({
        "email": email,
        "password": password
    });

    ajaxRequest.send(dataset);

}