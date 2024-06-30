var inputvalue = document.querySelector('#cityinput');
var btn = document.querySelector('#add');
var city = document.querySelector('#cityoutput');
var weatherIcon = document.querySelector('#weatherIcon');
var descrip = document.querySelector('#description');
var temp = document.querySelector('#temp');
var humidity = document.querySelector('#humidity');
var pressure = document.querySelector('#pressure');
var wind = document.querySelector('#wind');
var forecastContainer = document.querySelector('#forecast');
var apik = "bd5e378503939ddaee76f12ad7a97608"; // Replace with your actual API key

function conversion(val) {
    return (val - 273.15).toFixed(0); // Correct the conversion factor to 273.15 for accuracy
}

btn.addEventListener('click', function() {
    var cityName = inputvalue.value;
    if (!cityName) {
        alert('Please enter a city name');
        return;
    }
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + apik)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            var nameVal = data.name;
            var description = data.weather[0].description;
            var icon = data.weather[0].icon;
            var temperature = data.main.temp;
            var humidityVal = data.main.humidity;
            var pressureVal = data.main.pressure;
            var windSpeed = data.wind.speed;

            city.innerHTML = `Weather of <span>${nameVal}</span>`;
            weatherIcon.src = `http://openweathermap.org/img/wn/${icon}.png`;
            temp.innerHTML = `Temperature: <span>${conversion(temperature)}°C</span>`;
            descrip.innerHTML = `Sky Conditions: <span>${description}</span>`;
            humidity.innerHTML = `Humidity: <span>${humidityVal}%</span>`;
            pressure.innerHTML = `Pressure: <span>${pressureVal} hPa</span>`;
            wind.innerHTML = `Wind Speed: <span>${windSpeed} km/h</span>`;

            // Fetch 5-day forecast
            fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&appid=' + apik)
                .then(response => response.json())
                .then(data => {
                    forecastContainer.innerHTML = ''; // Clear previous forecast
                    for (let i = 0; i < data.list.length; i += 8) { // Get daily forecast at noon
                        var day = data.list[i];
                        var date = new Date(day.dt_txt).toDateString();
                        var icon = day.weather[0].icon;
                        var temp = conversion(day.main.temp);
                        var desc = day.weather[0].description;

                        forecastContainer.innerHTML += `
                            <div class="forecast-day">
                                <h3>${date}</h3>
                                <img src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">
                                <p>${temp}°C</p>
                                <p>${desc}</p>
                            </div>
                        `;
                    }
                });
        })
        .catch(err => {
            alert('You entered a wrong city name or the API key is invalid');
            console.error('Error:', err);
        });
});
