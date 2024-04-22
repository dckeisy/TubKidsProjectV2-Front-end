const characterImages = document.getElementById('characterImages');
const avatarUrlInput = document.getElementById('AvatarUrl');


fetch('https://api.disneyapi.dev/character')
    .then(response => response.json())
    .then(json => {
        json.data.forEach(character => {

            const url = character.imageUrl;
            const img = document.createElement('img');
            img.src = url;
            img.className = 'carousel-item';

            // Agregar evento click para seleccionar la imagen
            img.addEventListener('click', function () {
                const selectedUrl = this.src;
                avatarUrlInput.value = selectedUrl;
                console.log('URL seleccionada:', selectedUrl);
            });

            characterImages.appendChild(img);
        });
    })
    .catch(error => console.error('Error al obtener las imágenes de los personajes:', error));