var inputvalue = document.querySelector('#cityinput');
var btn = document.querySelector('#add');
var city = document.querySelector('#cityoutput');
var descrip = document.querySelector('#description');
var temp = document.querySelector('#temp');
var wind = document.querySelector('#wind');
var apik = "bd5e378503939ddaee76f12ad7a97608";  // Replace with your actual API key

function convertion(val) {
    return (val - 273.15).toFixed(3);  // Correct the conversion factor to 273.15 for accuracy
}

btn.addEventListener('click', function() {
    var cityName = inputvalue.value;
    if (!cityName) {
        alert('Please enter a city name');
        return;
    }
    fetch('https://api.openweathermap.org/data/2.5/weather?q='+inputvalue.value+'&appid='+apik)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            var nameVal = data.name;
            var description = data.weather[0].description;
            var temperature = data.main.temp;
            var windSpeed = data.wind.speed;

            city.innerHTML = `Weather of <span>${nameVal}</span>`;
            temp.innerHTML = `Temperature: <span>${convertion(temperature)} C</span>`;
            descrip.innerHTML = `Sky Conditions: <span>${description}</span>`;
            wind.innerHTML = `Wind Speed: <span>${windSpeed} km/h</span>`;
        })
        .catch(err => {
            alert('You entered a wrong city name or the API key is invalid');
            console.error('Error:', err);
        });
});
