document.getElementById('search-button').addEventListener('click', () => {
    const city = document.getElementById('city-search').value;
    if (city) {
        fetchWeatherData(city);
    }
});

function fetchWeatherData(city) {
    const apiKey = '6643699d4cc1412757dc072a17834450';  // Your OpenWeatherMap API key
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=Shirpur&units=metric&appid=6643699d4cc1412757dc072a17834450`)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data);
            const googleWeatherLink = `https://www.google.com/search?q=${city}+weather`;
            document.getElementById('google-weather-link').href = googleWeatherLink;
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

function displayCurrentWeather(data) {
    document.getElementById('temp').textContent = data.main.temp;
    document.getElementById('humidity').textContent = data.main.humidity;
    document.getElementById('wind-speed').textContent = data.wind.speed;
    document.getElementById('conditions').textContent = data.weather[0].description;

    let weatherIcon;
    switch (data.weather[0].main.toLowerCase()) {
        case 'clear':
            weatherIcon = 'sun';
            break;
        case 'clouds':
            weatherIcon = 'cloud';
            break;
        case 'rain':
            weatherIcon = 'rain';
            break;
        default:
            weatherIcon = 'cloud';
    }
    document.getElementById('current-weather-display').className = weatherIcon;
}
