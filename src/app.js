import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import haversine from 'haversine';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

document.addEventListener('DOMContentLoaded', () => {
    // Fix Leaflet's default icon paths
    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
        iconRetinaUrl: markerIcon2x,
        iconUrl: markerIcon,
        shadowUrl: markerShadow,
    });

    let map;

    // Function to initialize the map
    function initMap(userCoordinates) {
        map = L.map('map').setView([userCoordinates.latitude, userCoordinates.longitude], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    
        // Coordinates of the KPU Surrey Library
        const KPU_SURREY_LIBRARY_COORDINATES = { latitude: 49.13196, longitude: -122.87123 };
    
        // Add markers for the user and the library
        const userMarker = L.marker([userCoordinates.latitude, userCoordinates.longitude]).addTo(map).bindPopup('Your Location');
        const libraryMarker = L.marker([KPU_SURREY_LIBRARY_COORDINATES.latitude, KPU_SURREY_LIBRARY_COORDINATES.longitude]).addTo(map).bindPopup('KPU Surrey Library').openPopup();
    
        // Create a polyline between user location and library
        const polyline = L.polyline([
            [userCoordinates.latitude, userCoordinates.longitude],
            [KPU_SURREY_LIBRARY_COORDINATES.latitude, KPU_SURREY_LIBRARY_COORDINATES.longitude]
        ], { color: 'blue' }).addTo(map);
    
        // Calculate the distance using haversine method
        const distance = haversine(userCoordinates, KPU_SURREY_LIBRARY_COORDINATES, { unit: 'km' });
    
        // Display the distance
        document.getElementById('distance').innerText = `Distance to KPU Surrey Library: ${distance.toFixed(2)} km`;
    }

    // Check if geolocation is available
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const userCoordinates = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };

            if (!map) {
                initMap(userCoordinates);
            }
        }, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }

    // Function to handle geolocation errors
    function showError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                alert("User denied the request for Geolocation.");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                alert("The request to get user location timed out.");
                break;
            case error.UNKNOWN_ERROR:
                alert("An unknown error occurred.");
                break;
        }
    }
});
