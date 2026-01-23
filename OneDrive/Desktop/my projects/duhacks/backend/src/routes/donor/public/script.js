const socket = io();

// Sign Out Handler
document.getElementById('signoutBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to sign out?')) {
        // Stop sharing location
        socket.disconnect();
        
        // Redirect to login or home page
        window.location.href = '/login';
    }
});

// 1. Initialize Map (Centered on Mangalore, India based on your screenshot)
const map = L.map('map').setView([12.9141, 74.8560], 15);

// 2. Add Map Skin
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// --- BLUE MARKER (Hospital/Recipient) ---
const hospitalMarker = L.marker([12.9170, 74.8600], {
    draggable: true,
    title: "Hospital"
}).addTo(map);

hospitalMarker.bindPopup("<b>Destination</b><br>Hospital Location").openPopup();

// --- RED MARKER SETUP (Donors) ---
const redIcon = L.divIcon({
    className: 'red-donor-icon', // CSS class from style.css
    iconSize: [16, 16],
    iconAnchor: [8, 8]
});

const markers = {}; // Store markers to update them live

// Function to add a donor visually
function updateDonorMarker(id, lat, lng, name) {
    if (markers[id]) {
        // If marker exists, just move it
        markers[id].setLatLng([lat, lng]);
    } else {
        // If new, create it
        const marker = L.marker([lat, lng], { icon: redIcon }).addTo(map);
        
        // Add the label (Tooltip)
        marker.bindTooltip(name, {
            permanent: true,
            direction: 'right',
            className: 'donor-label',
            offset: [10, 0]
        });
        
        markers[id] = marker;
    }
}

// --- FAKE DATA (To match your screenshot exactly) ---
updateDonorMarker("static1", 12.9141, 74.8560, "M K Subrahmanya (O+)");
updateDonorMarker("static2", 12.9125, 74.8540, "Rahul Sharma (B+)");

// --- REAL LIVE TRACKING ---

// 1. Send MY location
if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        // Send to server
        socket.emit("send-location", { latitude, longitude });
    }, 
    (error) => console.log(error),
    { enableHighAccuracy: true });
}

// 2. Receive OTHERS' location
socket.on("receive-location", (data) => {
    // When someone else joins, show them as a Live Donor
    updateDonorMarker(data.id, data.latitude, data.longitude, "Live Donor (You)");
});

// 3. Remove disconnected users
socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});