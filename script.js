const WEATHER_API_KEY = "e05b62654e6c45cd14527d2484cc9c40"; // Replace with your key

const searchInput = document.getElementById('searchInput');
const suggestionBox = document.getElementById('suggestions');
const weatherCard = document.getElementById('weatherCard');
const errorMsg = document.getElementById('errorMsg');

// 1. Fetch suggestions as user types
searchInput.addEventListener('input', async () => {
    const query = searchInput.value.trim();
    if (query.length < 2) { suggestionBox.style.display = 'none'; return; }

    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${WEATHER_API_KEY}`;
    
    try {
        const res = await fetch(geoUrl);
        const cities = await res.json();
        
        if (cities.length > 0) {
            suggestionBox.innerHTML = cities.map(city => 
                `<li onclick="selectCity('${city.name}, ${city.country}')">${city.name}, ${city.country}</li>`
            ).join('');
            suggestionBox.style.display = 'block';
        }
    } catch (err) { console.error("Suggestions failed", err); }
});

function selectCity(name) {
    searchInput.value = name;
    suggestionBox.style.display = 'none';
    fetchWeather(name);
}

// 2. Fetch and display weather
async function fetchWeather(query) {
    // Clean query (removes "weather" or "in" from typing)
    const city = query.toLowerCase().replace("weather", "").replace("in", "").trim();
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${WEATHER_API_KEY}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.cod === 200) {
            document.getElementById('wTemp').innerText = Math.round(data.main.temp) + "°C";
            document.getElementById('wCity').innerText = data.name;
            document.getElementById('wHum').innerText = data.main.humidity + "%";
            document.getElementById('wWind').innerText = data.wind.speed + " km/h";
            document.getElementById('wDesc').innerText = data.weather[0].description;
            document.getElementById('wIcon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
            
            weatherCard.style.display = 'flex';
            errorMsg.style.display = 'none';
        } else {
            showError();
        }
    } catch (err) { showError(); }
}

function showError() {
    weatherCard.style.display = 'none';
    errorMsg.style.display = 'block';
}

document.getElementById('searchBtn').addEventListener('click', () => fetchWeather(searchInput.value));

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (e.target !== searchInput) suggestionBox.style.display = 'none';
});