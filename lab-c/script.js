function requestPermissions() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => console.log("Geolocation granted"),
            (error) => console.error("Geolocation denied")
        );
    }

    if ("Notification" in window) {
        Notification.requestPermission().then((permission) => {
            console.log("Notification permission:", permission);
        });
    }
}

let map;
function initializeMap() {
    map = L.map("map").setView([51.505, -0.09], 13);

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri'
    }).addTo(map);
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            map.setView([latitude, longitude], 20);

            L.marker([latitude, longitude]).addTo(map)
                .bindPopup("Twoja lokalizacja!")
                .openPopup();
        });
    } else {
        alert("Geolokalizacja nie jest wspierana przez twoją przeglądarkę.");
    }
}

function getMap(){
    document.querySelector('.leaflet-control-zoom').style.display = 'none';
    leafletImage(map, function(err, canvas) {
        document.querySelector('.leaflet-control-zoom').style.display = '';
        const img = document.getElementById('map-holder');
        img.src = canvas.toDataURL();
        splitImg(canvas);
        console.log("wszystko git")
    });
}

function splitImg(canvas){
    let puzzleBoard = document.getElementById("puzzle-container");
    puzzleBoard.innerHTML = ''; // Wyczyść planszę puzzli
    
    const rows = 3; // Liczba wierszy
    const cols = 4; // Liczba kolumn
    const pieceWidth = canvas.width / cols; // Szerokość jednego puzzla
    const pieceHeight = canvas.height / rows; // Wysokość jednego puzzla
    const pieces = [];

    // Twórz fragmenty mapy jako osobne elementy <canvas>
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            // Tworzenie nowego elementu canvas dla puzzla
            const piece = document.createElement('div');
            piece.classList.add("puzzle");
            piece.style.backgroundImage = `url(${canvas.toDataURL()})`;
            piece.style.backgroundPosition = `-${x * pieceWidth}px -${y * pieceHeight}px`;
            piece.draggable = true;
            piece.dataset.index = y * 4 + x;
            pieces.push(piece);
        }
    }

    pieces.sort(() => Math.random() - 0.5).forEach(piece => puzzleBoard.appendChild(piece));
}

document.addEventListener("DOMContentLoaded", () => {
    requestPermissions();
    initializeMap();

    document.getElementById("set-location").addEventListener("click", getLocation);
    document.getElementById("get-map").addEventListener("click", getMap);
});

