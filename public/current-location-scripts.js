document.getElementById('searchButton').addEventListener('click', function() {
    const locationInput = document.getElementById('locationInput').value;
    if (locationInput) {
        getWeather(locationInput);
    } else {
        alert('Please enter a city');
    }
});

function getWeather(location) {
    const apiKey = '170aa34085092a03aa1d6f16ce7475f4'; // Your OpenWeatherMap API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            alert(error.message);
        });
}

function displayWeather(data) {
    document.getElementById('location').textContent = data.name + ', ' + data.sys.country;
    document.getElementById('temperature').textContent = data.main.temp + ' °C';
    document.getElementById('humidity').textContent = data.main.humidity;
    document.getElementById('wind-speed').textContent = data.wind.speed;
    document.getElementById('conditions').textContent = data.weather[0].description;
    document.getElementById('pressure').textContent = data.main.pressure;
    document.getElementById('cloud-cover').textContent = data.clouds.all;
    document.getElementById('visibility').textContent = (data.visibility / 1000).toFixed(1);
    document.getElementById('dew-point').textContent = calculateDewPoint(data.main.temp, data.main.humidity).toFixed(1);
}

function calculateDewPoint(temperature, humidity) {
    const a = 17.27;
    const b = 237.7;
    const alpha = ((a * temperature) / (b + temperature)) + Math.log(humidity / 100);
    const dewPoint = (b * alpha) / (a - alpha);
    return dewPoint;
}
