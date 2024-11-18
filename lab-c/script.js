// Request permissions for location and notifications
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

// Initialize Leaflet map
let map;
function initializeMap() {
    map = L.map("map").setView([51.505, -0.09], 13);

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap contributors"
    }).addTo(map);
}

// Get user location and add marker on map
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            map.setView([latitude, longitude], 13);

            L.marker([latitude, longitude]).addTo(map)
                .bindPopup("Twoja lokalizacja")
                .openPopup();
        });
    } else {
        alert("Geolokalizacja nie jest wspierana przez twoją przeglądarkę.");
    }
}

function exportMap() {
    const mapContainer = document.getElementById("map");

    // Capture map using html2canvas
    html2canvas(mapContainer).then(canvas => {
        const imgData = canvas.toDataURL("image/png");

        try {
            // Store the image in localStorage
            localStorage.setItem("capturedMap", imgData);
            alert("Mapa została zapisana w pamięci przeglądarki!");

            // Optionally, you can trigger a download as well
            const downloadLink = document.createElement("a");
            downloadLink.href = imgData;
            downloadLink.download = "mapa.png";
            downloadLink.click();

        } catch (error) {
            console.error("Failed to save map to localStorage:", error);
            alert("Nie udało się zapisać mapy. Prawdopodobnie przekroczono limit pamięci.");
        }
    }).catch(error => {
        console.error("Error capturing map:", error);
        alert("Wystąpił problem podczas eksportowania mapy.");
    });
}

// Initialize drag-and-drop elements
function initializeTable() {
    const table = document.getElementById("table");

    for (let i = 0; i < 16; i++) {
        const item = document.createElement("div");
        item.className = "table-item";
        item.draggable = true;
        item.id = `item-${i + 1}`;
        item.innerText = i + 1;

        item.addEventListener("dragstart", dragStart);
        item.addEventListener("dragover", dragOver);
        item.addEventListener("drop", drop);
        table.appendChild(item);
    }
}

// Drag-and-drop functions
function dragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const draggedId = event.dataTransfer.getData("text/plain");
    const draggedElement = document.getElementById(draggedId);

    if (draggedElement && draggedElement.parentNode === event.target) {
        draggedElement.classList.add("correct");
        checkCompletion();
    }
    event.target.appendChild(draggedElement);
}

// Check if all items are in correct positions
function checkCompletion() {
    const items = document.querySelectorAll(".table-item");
    let allCorrect = true;

    items.forEach((item) => {
        if (!item.classList.contains("correct")) {
            allCorrect = false;
        }
    });

    if (allCorrect) {
        showCompletionNotification();
    }
}

// Show notification on completion
function showCompletionNotification() {
    if (Notification.permission === "granted") {
        new Notification("Wszystkie elementy są na swoim miejscu!");
    } else {
        alert("Wszystkie elementy są na swoim miejscu!");
    }
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
    requestPermissions();
    initializeMap();
    initializeTable();

    document.getElementById("getLocation").addEventListener("click", getLocation);
    document.getElementById("exportMap").addEventListener("click", exportMap);
});
