function getWeather() {
    const location = document.getElementById('location-input').value;
    const apiKey = '170aa34085092a03aa1d6f16ce7475f4';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayForecast(data);
            drawChart(data);
        })
        .catch(error => {
            console.error('Error fetching the weather data:', error);
        });
}

function displayForecast(data) {
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';

    const forecast = {};

    data.list.forEach(entry => {
        const date = entry.dt_txt.split(' ')[0];
        if (!forecast[date]) {
            forecast[date] = [];
        }
        forecast[date].push(entry);
    });

    Object.keys(forecast).forEach(date => {
        const dayForecast = forecast[date];
        const tempSum = dayForecast.reduce((sum, entry) => sum + entry.main.temp, 0);
        const avgTemp = tempSum / dayForecast.length;
        const windSpeed = dayForecast[0].wind.speed;
        const precipitation = dayForecast[0].pop * 100;

        const dayElement = document.createElement('div');
        dayElement.classList.add('day-forecast');

        dayElement.innerHTML = `
            <p><strong>${date}</strong></p>
            <p>Avg Temp: ${avgTemp.toFixed(1)}°C</p>
            <p>Wind: ${windSpeed} m/s</p>
            <p>Precipitation: ${precipitation}%</p>
        `;

        forecastContainer.appendChild(dayElement);
    });
}

function drawChart(data) {
    const dates = [];
    const temperatures = [];

    const forecast = {};

    data.list.forEach(entry => {
        const date = entry.dt_txt.split(' ')[0];
        if (!forecast[date]) {
            forecast[date] = [];
        }
        forecast[date].push(entry);
    });

    Object.keys(forecast).forEach(date => {
        const dayForecast = forecast[date];
        const tempSum = dayForecast.reduce((sum, entry) => sum + entry.main.temp, 0);
        const avgTemp = tempSum / dayForecast.length;

        dates.push(date);
        temperatures.push(avgTemp.toFixed(1));
    });

    const ctx = document.getElementById('forecastChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Average Temperature (°C)',
                data: temperatures,
                borderColor: 'rgba(255, 255, 0, 1)', // Yellow color
                borderWidth: 5,
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Temperature (°C)'
                    }
                }
            }
        }
    });
}
