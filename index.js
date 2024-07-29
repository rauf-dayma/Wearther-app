// HTML Elements
const searchButton = document.getElementById('search-button');
const locationButton = document.querySelector('.locationButton');
const weatherDisplay = document.querySelector(".weatherDisplay");
const searchHistoryContainer = document.getElementById('search-history');
const menuIcon = document.querySelector(".menu-icon");
const sidebar = document.getElementById('sidebar');
const arrowIcon = document.querySelector('#arrow-icon');

//WeatherAPI key
const apiKey = '978c86ef7312455fa98151044242607';

// Initialize search history
let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

// Add event listeners
searchButton.addEventListener('click', handleSearch);
locationButton.addEventListener('click', handleLocationSearch);
menuIcon.addEventListener('click', () => sidebar.classList.toggle('active'));
arrowIcon.addEventListener('click', () => sidebar.classList.remove('active'));

// Handle city search
function handleSearch() {
    const city = document.getElementById('city-input').value.trim();
    if (!validateCity(city)) {
        alert('Please enter a valid city name.');
        return;
    }
    fetchWeatherDataByCity(city);
}

// Handle location search
function handleLocationSearch() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(fetchWeatherDataByCoords, showError);
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

// Validate city name
function validateCity(city) {
    const regex = /^[a-zA-Z\s]+$/;
    return city.length > 0 && regex.test(city);
}

// Fetch weather data by city
async function fetchWeatherDataByCity(city) {
    const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5&aqi=no&alerts=no`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        displayCurrentWeather(result);
        displayForecast(result.forecast);
        saveToSearchHistory(result);
        updateSearchHistoryUI();
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data. Please check the console for details.');
    }
}

// Fetch weather data by coordinates
async function fetchWeatherDataByCoords(position) {
    const { latitude, longitude } = position.coords;
    const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=5&aqi=no&alerts=no`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        displayCurrentWeather(result);
        displayForecast(result.forecast);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data. Please check the console for details.');
    }
}

// Show geolocation error
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

// Display current weather
function displayCurrentWeather(data) {
    const existingContainer = document.querySelector(".current-container");
    if (existingContainer) {
        weatherDisplay.removeChild(existingContainer);
    }

    const weatherContainer = document.createElement("div");
    weatherContainer.classList.add("current-container");
    weatherDisplay.appendChild(weatherContainer);

    weatherContainer.innerHTML = `
        <div class="weather-item">
            <span class="weather-icon">${getWeatherIcon(data.current.condition.text)}</span>
            <span class="weather-label">City:</span> <span class="weather-value">${data.location.name}</span>
        </div>
        <div class="weather-item">
            <span class="weather-label">Temperature:</span> <span class="weather-value">${data.current.temp_f}°F</span>
        </div>
        <div class="weather-item">
            <span class="weather-label">Condition:</span> <span class="weather-value">${data.current.condition.text}</span>
        </div>
        <div class="weather-item">
            <span class="weather-label">Humidity:</span> <span class="weather-value">${data.current.humidity}%</span>
        </div>
        <div class="weather-item">
            <span class="weather-label">Wind Speed:</span> <span class="weather-value">${data.current.wind_mph} mph</span>
        </div>
    `;
}

// Display forecast
function displayForecast(forecastData) {
    const forecastContainer = document.querySelector(".forecast-container");
    if (forecastContainer) {
        weatherDisplay.removeChild(forecastContainer);
    }

    const newForecastContainer = document.createElement("div");
    newForecastContainer.classList.add("forecast-container");
    weatherDisplay.appendChild(newForecastContainer);

    forecastData.forecastday.forEach(day => {
        const forecastCard = document.createElement("div");
        forecastCard.classList.add("forecast-card");

        forecastCard.innerHTML = `
            <div class="forecast-date">${new Date(day.date).toDateString()}</div>
            <div class="forecast-details">
                <div class="weather-icon">${getWeatherIcon(day.day.condition.text)}</div>
                <div class="forecast-item">
                    <span class="forecast-label">Max Temp:</span> <span class="forecast-value">${day.day.maxtemp_f}°F</span>
                </div>
                <div class="forecast-item">
                    <span class="forecast-label">Min Temp:</span> <span class="forecast-value">${day.day.mintemp_f}°F</span>
                </div>
                <div class="forecast-item">
                    <span class="forecast-label">Condition:</span> <span class="forecast-value">${day.day.condition.text}</span>
                </div>
                <div class="forecast-item">
                    <span class="forecast-label">Humidity:</span> <span class="forecast-value">${day.day.avghumidity}%</span>
                </div>
                <div class="forecast-item">
                    <span class="forecast-label">Wind Speed:</span> <span class="forecast-value">${day.day.maxwind_mph} mph</span>
                </div>
            </div>
        `;

        newForecastContainer.appendChild(forecastCard);
    });
}

// Get weather icon based on condition
function getWeatherIcon(condition) {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('cloud')) {
        return '<svg class="weather-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M32 12a8 8 0 0 0 0 16h16a8 8 0 0 0 0-16zm0 32a8 8 0 0 0-8 8 8 8 0 0 0 8 8h16a8 8 0 0 0 0-16z" fill="#333"/></svg>';
    } else if (lowerCondition.includes('sun')) {
        return '<svg class="weather-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M32 12a8 8 0 0 0 0 16h16a8 8 0 0 0 0-16zm0 32a8 8 0 0 0-8 8 8 8 0 0 0 8 8h16a8 8 0 0 0 0-16z" fill="#f9d71c"/></svg>';
    } else if (lowerCondition.includes('wind')) {
        return '<svg class="weather-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M32 12a8 8 0 0 0 0 16h16a8 8 0 0 0 0-16zm0 32a8 8 0 0 0-8 8 8 8 0 0 0 8 8h16a8 8 0 0 0 0-16z" fill="#95a5a6"/></svg>';
    } else {
        return '<svg class="weather-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M32 12a8 8 0 0 0 0 16h16a8 8 0 0 0 0-16zm0 32a8 8 0 0 0-8 8 8 8 0 0 0 8 8h16a8 8 0 0 0 0-16z" fill="#999"/></svg>';
    }
}

// Save search result to local storage
function saveToSearchHistory(data) {
    const city = data.location.name;
    const current = data.current;
    const forecast = data.forecast.forecastday;

    // Remove the city if it already exists in the history
    searchHistory = searchHistory.filter(item => item.city !== city);

    // Add new entry to the beginning of the history
    searchHistory.unshift({ city, current, forecast });

    // Limit history to 10 items
    if (searchHistory.length > 10) {
        searchHistory.pop();
    }

    // Save to local storage
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

// Update search history UI
function updateSearchHistoryUI() {
    searchHistoryContainer.innerHTML = '';
    searchHistory.forEach(item => {
        const historyDiv = document.createElement('div');
        historyDiv.classList.add('history-item');
        
        const cityIcon = document.createElement('div');
        cityIcon.classList.add('city-icon');
        cityIcon.innerHTML = getWeatherIcon(item.current.condition.text); 
        
        const cityName = document.createElement('div');
        cityName.classList.add('city-name');
        cityName.textContent = item.city;
        
        const temperature = document.createElement('div');
        temperature.classList.add('temperature');
        temperature.textContent = `${item.current.temp_f}°F`;
        
        historyDiv.appendChild(cityIcon);
        historyDiv.appendChild(cityName);
        historyDiv.appendChild(temperature);

        historyDiv.addEventListener('click', () => {
            displayCurrentWeather({ location: { name: item.city }, current: item.current });
            displayForecast({ forecastday: item.forecast });
            sidebar.classList.remove('active'); // Collapse sidebar on item click
        });

        searchHistoryContainer.appendChild(historyDiv);
    });
}

// Initialize the search history UI on page load
updateSearchHistoryUI();
