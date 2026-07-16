// API Configuration
const API_KEY = 'demo'; // Free tier - use your own key from openweathermap.org
const WEATHER_API_BASE = 'https://api.openweathermap.org/data/2.5';
const FORECAST_API_BASE = 'https://api.openweathermap.org/data/3.0';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const gpsBtn = document.getElementById('gpsBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const currentWeatherDiv = document.getElementById('currentWeather');
const forecastSection = document.getElementById('forecastSection');
const hourlySection = document.getElementById('hourlySection');
const sunSection = document.getElementById('sunSection');
const recentSearches = document.getElementById('recentSearches');
const suggestionsDiv = document.getElementById('suggestions');

// Local Storage
const STORAGE_KEY = 'weatherSearchHistory';

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
gpsBtn.addEventListener('click', handleGPS);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});
searchInput.addEventListener('input', handleSuggestions);

// Search History Functions
function getSearchHistory() {
    const history = localStorage.getItem(STORAGE_KEY);
    return history ? JSON.parse(history) : [];
}

function addToSearchHistory(city) {
    let history = getSearchHistory();
    history = history.filter(item => item !== city);
    history.unshift(city);
    history = history.slice(0, 5);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    displayRecentSearches();
}

function displayRecentSearches() {
    const history = getSearchHistory();
    const recentList = document.getElementById('recentList');
    
    if (history.length === 0) {
        recentSearches.classList.add('hidden');
        return;
    }
    
    recentList.innerHTML = history.map(city => 
        `<div class="recent-item" onclick="searchCity('${city}')">🌍 ${city}</div>`
    ).join('');
    recentSearches.classList.remove('hidden');
}

// Suggestions
async function handleSuggestions(e) {
    const query = e.target.value.trim();
    
    if (query.length < 2) {
        suggestionsDiv.classList.remove('active');
        return;
    }
    
    try {
        const response = await fetch(
            `${WEATHER_API_BASE}/find?q=${query}&type=like&appid=${API_KEY}`
        );
        const data = await response.json();
        
        if (data.list && data.list.length > 0) {
            const suggestions = data.list.slice(0, 5);
            suggestionsDiv.innerHTML = suggestions.map(city => `
                <div class="suggestion-item" onclick="searchCity('${city.name}')">
                    🌍 ${city.name}, ${city.sys.country}
                </div>
            `).join('');
            suggestionsDiv.classList.add('active');
        }
    } catch (error) {
        console.error('Suggestion error:', error);
    }
}

// Main Search Functions
function handleSearch() {
    const city = searchInput.value.trim();
    if (city) {
        searchCity(city);
    }
}

async function searchCity(city) {
    suggestionsDiv.classList.remove('active');
    searchInput.value = city;
    showLoading(true);
    hideError();
    
    try {
        const weatherResponse = await fetch(
            `${WEATHER_API_BASE}/weather?q=${city}&units=metric&appid=${API_KEY}`
        );
        
        if (!weatherResponse.ok) {
            throw new Error('City not found');
        }
        
        const weatherData = await weatherResponse.json();
        addToSearchHistory(city);
        
        // Fetch additional data (5-day forecast, hourly)
        await Promise.all([
            fetchForecast(weatherData.coord.lat, weatherData.coord.lon),
            fetchHourlyForecast(weatherData.coord.lat, weatherData.coord.lon),
            updateCurrentWeather(weatherData)
        ]);
    } catch (error) {
        showError(error.message);
    } finally {
        showLoading(false);
    }
}

function handleGPS() {
    if (!navigator.geolocation) {
        showError('Geolocation not supported by your browser');
        return;
    }
    
    showLoading(true);
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            getWeatherByCoordinates(latitude, longitude);
        },
        (error) => {
            showError('Could not get your location');
            showLoading(false);
        }
    );
}

async function getWeatherByCoordinates(lat, lon) {
    try {
        const response = await fetch(
            `${WEATHER_API_BASE}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );
        const data = await response.json();
        
        await Promise.all([
            fetchForecast(lat, lon),
            fetchHourlyForecast(lat, lon),
            updateCurrentWeather(data)
        ]);
    } catch (error) {
        showError('Failed to fetch weather data');
    } finally {
        showLoading(false);
    }
}

// Update Current Weather
function updateCurrentWeather(data) {
    const {
        name,
        sys: { country },
        coord: { lat, lon },
        main: { temp, feels_like, humidity, pressure },
        weather,
        wind: { speed, deg },
        visibility,
        clouds: { all: cloudiness },
        sys: { sunrise, sunset }
    } = data;
    
    const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
    const windDirection = getWindDirection(deg);
    
    // Update DOM
    document.getElementById('cityName').textContent = `${name}, ${country}`;
    document.getElementById('coordinates').textContent = `${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`;
    document.getElementById('temperature').textContent = Math.round(temp);
    document.getElementById('weatherIcon').src = iconUrl;
    document.getElementById('condition').textContent = capitalizeFirstLetter(weather[0].description);
    document.getElementById('feelsLike').textContent = `${Math.round(feels_like)}°C`;
    document.getElementById('humidity').textContent = `${humidity}%`;
    document.getElementById('pressure').textContent = `${pressure} hPa`;
    document.getElementById('windSpeed').textContent = `${speed} m/s`;
    document.getElementById('windDirection').textContent = windDirection;
    document.getElementById('visibility').textContent = `${(visibility / 1000).toFixed(1)} km`;
    document.getElementById('sunrise').textContent = formatTime(new Date(sunrise * 1000));
    document.getElementById('sunset').textContent = formatTime(new Date(sunset * 1000));
    
    // Show sections
    currentWeatherDiv.classList.remove('hidden');
    sunSection.classList.remove('hidden');
}

// Fetch 5-Day Forecast
async function fetchForecast(lat, lon) {
    try {
        const response = await fetch(
            `${WEATHER_API_BASE}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );
        const data = await response.json();
        
        // Get unique days
        const dailyForecasts = {};
        data.list.forEach(forecast => {
            const date = new Date(forecast.dt * 1000).toLocaleDateString();
            if (!dailyForecasts[date]) {
                dailyForecasts[date] = forecast;
            }
        });
        
        const forecastContainer = document.getElementById('forecastContainer');
        forecastContainer.innerHTML = Object.values(dailyForecasts).slice(0, 5).map(forecast => `
            <div class="forecast-card">
                <div class="forecast-date">${formatDate(new Date(forecast.dt * 1000))}</div>
                <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="Weather" class="forecast-icon">
                <div class="forecast-temp">${Math.round(forecast.main.temp)}°C</div>
                <div class="forecast-condition">${forecast.weather[0].main}</div>
                <div class="temp-range">💧 ${forecast.main.humidity}%</div>
            </div>
        `).join('');
        
        forecastSection.classList.remove('hidden');
    } catch (error) {
        console.error('Forecast error:', error);
    }
}

// Fetch Hourly Forecast
async function fetchHourlyForecast(lat, lon) {
    try {
        const response = await fetch(
            `${WEATHER_API_BASE}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );
        const data = await response.json();
        
        const hourlyContainer = document.getElementById('hourlyContainer');
        hourlyContainer.innerHTML = data.list.slice(0, 12).map(forecast => `
            <div class="hourly-card">
                <div class="hourly-time">${formatTime(new Date(forecast.dt * 1000))}</div>
                <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="Weather" class="hourly-icon">
                <div class="hourly-temp">${Math.round(forecast.main.temp)}°C</div>
                <div class="hourly-condition">${forecast.weather[0].main}</div>
            </div>
        `).join('');
        
        hourlySection.classList.remove('hidden');
    } catch (error) {
        console.error('Hourly forecast error:', error);
    }
}

// Utility Functions
function formatDate(date) {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function formatTime(date) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function getWindDirection(degrees) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round((degrees % 360) / 22.5) % 16;
    return directions[index];
}

// UI Functions
function showLoading(show) {
    if (show) {
        loadingSpinner.classList.remove('hidden');
    } else {
        loadingSpinner.classList.add('hidden');
    }
}

function showError(message) {
    errorMessage.textContent = `❌ ${message}`;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}

// Initialize
window.addEventListener('load', () => {
    displayRecentSearches();
});