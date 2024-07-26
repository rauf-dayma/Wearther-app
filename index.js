document.getElementById('search-button').addEventListener('click', async function() {
    const city = document.getElementById('city-input').value;
    const url = `https://yahoo-weather5.p.rapidapi.com/weather?location=${city}&format=json&u=f`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'a2dd9a2d84msh0de6f2153814d2cp1da085jsnf1be9c4e5b36',
            'x-rapidapi-host': 'yahoo-weather5.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        displayWeather(result);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data. Please check the console for details.');
    }
});

function displayWeather(data) {
    const container = document.getElementById('weather-container');
    container.innerHTML = `
        <p><strong>City:</strong> ${data.location.city}</p>
        <p><strong>Temperature:</strong> ${data.current_observation.condition.temperature}°F</p>
        <p><strong>Condition:</strong> ${data.current_observation.condition.text}</p>
        <p><strong>Humidity:</strong> ${data.current_observation.atmosphere.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${data.current_observation.wind.speed} mph</p>
    `;
}
