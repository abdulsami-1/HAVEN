// Initialize map with coordinates
const coordinates = window.markerCoordinates;
let MapTilerApi = MAPTILER_API_KEY;
const styleUrl = `https://api.maptiler.com/maps/streets/style.json?key=${MapTilerApi}`;

const map = new maplibregl.Map({
    container: 'map',
    style: styleUrl,
    center: coordinates && coordinates.length ? coordinates : [-118.2437, 34.0522],
    zoom: 12
});

map.addControl(new maplibregl.NavigationControl());

// Add marker when map loads
map.on('load', function () {
    if (coordinates && coordinates.length) {
        const el = document.createElement('div');
        el.className = 'smooth-marker';
        el.style.cssText = `
            width: 40px;
            height: 40px;
            position: relative;
            cursor: pointer;
        `;

        const svgElement = document.createElement('div');
        svgElement.innerHTML = `
            <svg width="40" height="40" viewBox="0 0 24 24" fill="red">
                <path d="M12 2C8.1 2 5 5.1 5 9c0 5.3 7 13 7 13s7-7.7 7-13c0-3.9-3.1-7-7-7zM12 
                11.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5s2.5 1.1 2.5 2.5S13.4 11.5 12 11.5z"/>
            </svg>
        `;
        svgElement.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            opacity: 1;
            transition: opacity 0.3s ease;
        `;

        const imgElement = document.createElement('img');
        imgElement.src = '/images/marker.png';
        imgElement.style.cssText = `
            width: 40px;
            height: 40px;
            position: absolute;
            top: 0;
            left: 0;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        el.appendChild(svgElement);
        el.appendChild(imgElement);

        el.addEventListener('mouseenter', () => {
            svgElement.style.opacity = '0';
            imgElement.style.opacity = '1';
        });

        el.addEventListener('mouseleave', () => {
            svgElement.style.opacity = '1';
            imgElement.style.opacity = '0';
        });

        new maplibregl.Marker({ element: el })
            .setLngLat(coordinates)
            .setPopup(new maplibregl.Popup({
                offset: 25,
                className: 'marker-popup',
                closeButton: false,
                closeOnClick: true
            }).setHTML(`
    <div class="popup-container">
        <div class="popup-icon">📍</div>
        <div class="popup-content">
            <div class="popup-title">Exact Location</div>
            <div class="popup-message">Provided after booking</div>
        </div>
    </div>
    <div class="popup-underline"></div>
`)).addTo(map)

        map.flyTo({ center: coordinates, zoom: 12, essential: true });
    }
});


