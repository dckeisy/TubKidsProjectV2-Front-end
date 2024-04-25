function getUserIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');
    console.log('ID del usuario:', userId);
    return userId;
}

function Verify(id) {
    const statusActive = "activo";
    const data = {
        "status": statusActive
    }

    const settings = {
        "async": true,
        "crossDomain": true,
        "url": `http://localhost:3001/api/users?id=${id}`,
        "method": "PUT",
        "headers": {
            "Content-Type": "application/json"
        },
        "processData": false,
        "data": JSON.stringify(data)
    };

    $.ajax(settings)
        .done(function (response) {
            console.log(response);
            showSuccessAlert();
            redirectToLogin();
        })
        .fail(function (error) {
            console.error(error);
            showErrorAlert();
        });
}

function showSuccessAlert() {
    const successAlert = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <strong>¡Cuenta verificada con éxito!</strong> Tu cuenta ha sido activada.
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    `;
    $('#alert-container').html(successAlert);
}

function showErrorAlert() {
    const errorAlert = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>¡Error al verificar la cuenta!</strong> Por favor, inténtalo más tarde.
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    `;
    $('#alert-container').html(errorAlert);
}

function redirectToLogin() {
    window.location.href = 'http://127.0.0.1:5500/TubKidsProjectV2-Front-end/user/login.html';
}