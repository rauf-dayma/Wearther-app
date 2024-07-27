const searchButton = document.getElementById('search-button');
const locationButton = document.querySelector('.locationButton');
const weatherDisplay = document.querySelector(".weatherDisplay");

// Your WeatherAPI key
const apiKey = '978c86ef7312455fa98151044242607';

searchButton.addEventListener('click', function() {
    const city = document.getElementById('city-input').value.trim();
    if (!validateCity(city)) {
        alert('Please enter a valid city name.');
        return;
    }
    fetchWeatherDataByCity(city);
});

locationButton.addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(fetchWeatherDataByCoords, showError);
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});

function validateCity(city) {
    // Check if the city name is not empty and contains only letters and spaces
    const regex = /^[a-zA-Z\s]+$/;
    return city.length > 0 && regex.test(city);
}

async function fetchWeatherDataByCity(city) {
    const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5&aqi=no&alerts=no`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        displayCurrentWeather(result);
        displayForecast(result.forecast.forecastday);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data. Please check the console for details.');
    }
}

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
        displayForecast(result.forecast.forecastday);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data. Please check the console for details.');
    }
}

function showError(error) {
    switch(error.code) {
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

function displayCurrentWeather(data) {
    const existingContainer = document.querySelector(".container");
    if (existingContainer) {
        weatherDisplay.removeChild(existingContainer);
    }

    const weatherContainer = document.createElement("div");
    weatherContainer.classList.add("container");
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

function displayForecast(forecast) {
    const forecastContainer = document.querySelector(".forecast-container");
    if (forecastContainer) {
        weatherDisplay.removeChild(forecastContainer);
    }

    const newForecastContainer = document.createElement("div");
    newForecastContainer.classList.add("forecast-container");
    weatherDisplay.appendChild(newForecastContainer);

    forecast.forEach(day => {
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
