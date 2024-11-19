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
        // document.getElementById('mapImageHolder').style.backgroundImage = `url(${img.src})`;
        splitImg(canvas);
        console.log("wszystko git")
    });
}

function splitImg(canvas){
    let puzzleBoard = document.getElementById("puzzle-container");
    puzzleBoard.innerHTML = ''; // Wyczyść planszę puzzli
    
    const rows = 3; // Liczba wierszy
    const cols = 4; // Liczba kolumn
    const puzzleWidth = canvas.width / cols; // Szerokość jednego puzzla
    const puzzleHeight = canvas.height / rows; // Wysokość jednego puzzla
    const puzzles = [];

    // Twórz fragmenty mapy jako osobne elementy <canvas>
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            // Tworzenie nowego elementu canvas dla puzzla
            const puzzle = document.createElement('div');
            puzzle.classList.add("puzzle");
            puzzle.style.backgroundImage = `url(${canvas.toDataURL()})`;
            puzzle.style.backgroundPosition = `-${x * puzzleWidth}px -${y * puzzleHeight}px`;
            puzzle.draggable = true;
            puzzle.dataset.index = y * cols + x;
            puzzles.push(puzzle);
        }
    }

    puzzles.sort(() => Math.random() - 0.5).forEach(puzzle => puzzleBoard.appendChild(puzzle));

    puzzles.forEach(puzzle => {
        puzzle.addEventListener("dragstart", dragStart);
    });

    const dropArea = document.getElementById("answear-container");
    dropArea.innerHTML = '';
    for (let y = 0; y < rows; y++){
        for (let x = 0; x < cols; x++){
            const dropZone = document.createElement("div");
            dropZone.classList.add("puzzle");
            dropZone.dataset.index = x;
            dropZone.addEventListener("drop", drop);
            dropZone.addEventListener("dragover", dragOver);
            dropArea.appendChild(dropZone);
        }
    }
}

function dragStart(event) {
    event.dataTransfer.setData("text", event.target.dataset.index);
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event){
    event.preventDefault();
    const draggedIndex = event.dataTransfer.getData("text");
    const draggedpuzzle = document.querySelector(`[data-index='${draggedIndex}']`);
    const targetpuzzle = event.target;

    if (!targetpuzzle.style.backgroundImage) {
        targetpuzzle.style.backgroundImage = draggedpuzzle.style.backgroundImage;
        targetpuzzle.style.backgroundPosition = draggedpuzzle.style.backgroundPosition;
        targetpuzzle.dataset.index = draggedpuzzle.dataset.index;
        draggedpuzzle.style.backgroundImage = '';
        draggedpuzzle.style.backgroundPosition = '';
        draggedpuzzle.dataset.index = '';
    } 
    else {
        const tempBackgroundImage = targetpuzzle.style.backgroundImage;
        const tempBackgroundPosition = targetpuzzle.style.backgroundPosition;
        const tempIndex = targetpuzzle.dataset.index;
        targetpuzzle.style.backgroundImage = draggedpuzzle.style.backgroundImage;
        targetpuzzle.style.backgroundPosition = draggedpuzzle.style.backgroundPosition;
        targetpuzzle.dataset.index = draggedpuzzle.dataset.index;
        draggedpuzzle.style.backgroundImage = tempBackgroundImage;
        draggedpuzzle.style.backgroundPosition = tempBackgroundPosition;
        draggedpuzzle.dataset.index = tempIndex;
    }

    refreshDragArea();
    completeCheck();
}

function refreshDragArea(){
    let allPuzzles = document.querySelectorAll('.puzzle');
    allPuzzles.forEach(puzzle => {
        puzzle.setAttribute('draggable', 'true');
        puzzle.addEventListener('dragstart', dragStart);
    });
}

function completeCheck(){
    const solvedPuzzles = Array.from(document.querySelectorAll("#answear-container .puzzle"));
    let isSolved = solvedPuzzles.every((puzzle, index) => {
        return puzzle.dataset.index == index && puzzle.style.backgroundImage;
    });

    if(isSolved){
        alert("Puzzle Complete!!!");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    requestPermissions();
    initializeMap();

    document.getElementById("set-location").addEventListener("click", getLocation);
    document.getElementById("get-map").addEventListener("click", getMap);
});

