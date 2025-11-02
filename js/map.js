/**
 * West LA EV Life - Charging Station Map
 * Interactive map showing EV charging locations in West Los Angeles
 */

// Wait for DOM and Leaflet to load
document.addEventListener('DOMContentLoaded', function() {
    initializeChargingMap();
});

function initializeChargingMap() {
    const mapElement = document.getElementById('charging-map');
    
    if (!mapElement) {
        console.log('Map element not found');
        return;
    }

    // Check if Leaflet is loaded
    if (typeof L === 'undefined') {
        console.error('Leaflet library not loaded');
        return;
    }

    // Initialize map centered on West Los Angeles
    const map = L.map('charging-map').setView([34.0522, -118.4437], 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    // Sample EV charging stations in West LA
    const chargingStations = [
        {
            name: "Tesla Supercharger - Santa Monica",
            lat: 34.0195,
            lng: -118.4912,
            type: "Tesla",
            color: "green",
            chargers: "8 Superchargers",
            speed: "DC Fast Charging"
        },
        {
            name: "ChargePoint - UCLA",
            lat: 34.0689,
            lng: -118.4452,
            type: "ChargePoint",
            color: "blue",
            chargers: "12 Level 2",
            speed: "Level 2"
        },
        {
            name: "EVgo - Westwood Village",
            lat: 34.0633,
            lng: -118.4456,
            type: "EVgo",
            color: "red",
            chargers: "4 DC Fast",
            speed: "DC Fast Charging"
        },
        {
            name: "ChargePoint - Brentwood",
            lat: 34.0634,
            lng: -118.4786,
            type: "ChargePoint",
            color: "blue",
            chargers: "6 Level 2",
            speed: "Level 2"
        },
        {
            name: "Tesla Supercharger - Century City",
            lat: 34.0569,
            lng: -118.4168,
            type: "Tesla",
            color: "green",
            chargers: "12 Superchargers",
            speed: "DC Fast Charging"
        },
        {
            name: "Electrify America - Santa Monica",
            lat: 34.0259,
            lng: -118.4965,
            type: "Other",
            color: "purple",
            chargers: "8 DC Fast",
            speed: "DC Fast Charging"
        },
        {
            name: "ChargePoint - Venice",
            lat: 33.9850,
            lng: -118.4695,
            type: "ChargePoint",
            color: "blue",
            chargers: "4 Level 2",
            speed: "Level 2"
        },
        {
            name: "EVgo - Marina del Rey",
            lat: 33.9802,
            lng: -118.4517,
            type: "EVgo",
            color: "red",
            chargers: "6 DC Fast",
            speed: "DC Fast Charging"
        },
        {
            name: "Tesla Destination - Beverly Hills",
            lat: 34.0736,
            lng: -118.4004,
            type: "Tesla",
            color: "green",
            chargers: "4 Destination",
            speed: "Level 2"
        },
        {
            name: "ChargePoint - Culver City",
            lat: 34.0211,
            lng: -118.3965,
            type: "ChargePoint",
            color: "blue",
            chargers: "8 Level 2",
            speed: "Level 2"
        },
        {
            name: "Blink - West LA",
            lat: 34.0408,
            lng: -118.4352,
            type: "Other",
            color: "purple",
            chargers: "3 Level 2",
            speed: "Level 2"
        },
        {
            name: "EVgo - Westwood",
            lat: 34.0581,
            lng: -118.4335,
            type: "EVgo",
            color: "red",
            chargers: "5 DC Fast",
            speed: "DC Fast Charging"
        }
    ];

    // Custom marker icons
    const markerIcons = {
        green: L.divIcon({
            className: 'custom-marker',
            html: '<div style="background-color: #16A34A; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
            iconSize: [12, 12],
            iconAnchor: [6, 6]
        }),
        blue: L.divIcon({
            className: 'custom-marker',
            html: '<div style="background-color: #3B82F6; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
            iconSize: [12, 12],
            iconAnchor: [6, 6]
        }),
        red: L.divIcon({
            className: 'custom-marker',
            html: '<div style="background-color: #EF4444; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
            iconSize: [12, 12],
            iconAnchor: [6, 6]
        }),
        purple: L.divIcon({
            className: 'custom-marker',
            html: '<div style="background-color: #A855F7; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
            iconSize: [12, 12],
            iconAnchor: [6, 6]
        })
    };

    // Add markers for each charging station
    chargingStations.forEach(station => {
        const marker = L.marker([station.lat, station.lng], {
            icon: markerIcons[station.color]
        }).addTo(map);

        // Create popup content
        const popupContent = `
            <div class="charging-station-popup" style="min-width: 200px;">
                <h3 style="font-weight: 600; font-size: 14px; margin-bottom: 8px; color: #1F2937;">
                    ${station.name}
                </h3>
                <div style="font-size: 12px; color: #6B7280; margin-bottom: 4px;">
                    <strong>Type:</strong> ${station.type}
                </div>
                <div style="font-size: 12px; color: #6B7280; margin-bottom: 4px;">
                    <strong>Chargers:</strong> ${station.chargers}
                </div>
                <div style="font-size: 12px; color: #6B7280; margin-bottom: 8px;">
                    <strong>Speed:</strong> ${station.speed}
                </div>
                <a href="https://www.google.com/maps/search/?api=1&query=${station.lat},${station.lng}" 
                   target="_blank" 
                   style="display: inline-block; background-color: #004AAD; color: white; padding: 4px 12px; border-radius: 4px; text-decoration: none; font-size: 12px;">
                    Get Directions
                </a>
            </div>
        `;

        marker.bindPopup(popupContent);
    });

    // Add a custom control for info
    const infoControl = L.control({ position: 'topleft' });
    infoControl.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'map-info-control');
        div.innerHTML = `
            <div style="background: white; padding: 10px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); font-size: 12px;">
                <strong style="color: #004AAD;">West LA EV Charging</strong><br>
                <span style="color: #6B7280;">Click markers for details</span>
            </div>
        `;
        return div;
    };
    infoControl.addTo(map);

    // Store map instance for potential future use
    window.chargingMap = map;

    console.log('Charging station map initialized with', chargingStations.length, 'stations');
}

// Filter functionality (for future enhancement)
function filterStations(type) {
    console.log('Filter by:', type);
    // This can be implemented to show/hide markers based on type
}

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initializeChargingMap, filterStations };
}
