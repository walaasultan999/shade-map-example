import * as L from 'leaflet';
import Simulator from 'leaflet-shadow-simulator';

/* Leaflet setup */
const map = L.map("mapid").setView([47.69682, -121.92078], 18);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
}).addTo(map);
/* End Leaflet setup */

/* ShadeMap setup */
const loaderEl = document.getElementById('loader');
let now = new Date();  // Initialize the date with the current time
const shadeMap = new Simulator({
    apiKey: "eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6IndhbGFhYWxzdWx0YW4xOTk4ODhAZ21haWwuY29tIiwiY3JlYXRlZCI6MTcyODIwODg2NDMyMSwiaWF0IjoxNzI4MjA4ODY0fQ.1wyzMuUWXPGRb3XUTV6iGDGPVdytSV0_ZiT9SwazqbI",
    date: now,
    color: '#01112f',
    opacity: 0.7,
    terrainSource: {
        maxZoom: 15,
        tileSize: 256,
        getSourceUrl: ({ x, y, z }) => `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${z}/${x}/${y}.png`,
        getElevation: ({ r, g, b, a }) => (r * 256 + g + b / 256) - 32768,
    },
}).addTo(map);

shadeMap.on('tileloaded', (loadedTiles, totalTiles) => {
    loaderEl.innerText = `Loading: ${(loadedTiles / totalTiles * 100).toFixed(0)}%`;
});
/* End ShadeMap setup */

/* Controls setup */
let intervalTimer;
const increment = document.getElementById('increment');
const decrement = document.getElementById('decrement');
const play = document.getElementById('play');
const stop = document.getElementById('stop');

increment.addEventListener('click', () => {
    now = new Date(now.getTime() + 3600000);  // Increment by 1 hour
    shadeMap.setDate(now);
}, false);

decrement.addEventListener('click', () => {
    now = new Date(now.getTime() - 3600000);  // Decrement by 1 hour
    shadeMap.setDate(now);
}, false);

play.addEventListener('click', () => {
    intervalTimer = setInterval(() => {
        now = new Date(now.getTime() + 60000);  // Increment by 1 minute
        shadeMap.setDate(now);
    }, 100);
});

stop.addEventListener('click', () => {
    clearInterval(intervalTimer);
});
/* End controls setup */

export { map, shadeMap };
