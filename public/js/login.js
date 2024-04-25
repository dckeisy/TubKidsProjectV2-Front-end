
VerifyUser = () => {
    const ajaxRequest = new XMLHttpRequest();
    ajaxRequest.addEventListener("load", function () {
        
        if (ajaxRequest.status >= 200 && ajaxRequest.status < 300) {
            const data = JSON.parse(ajaxRequest.responseText);
            if (data.token) {
                localStorage.setItem('token', data.token);
                console.log('Token guardado en localStorage');
                const verificationCode = data.verificationCode;
                const userVerificationCode = prompt("Ingresa el código de verificación enviado a tu teléfono:");
                if (userVerificationCode == verificationCode) {
                    window.location.href = 'profiles.html';
                } else {
                    alert('Código de verificación incorrecto');
                }
            } else {
                alert('Error de autenticación');
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