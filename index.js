const inputvalue = document.querySelector('#cityinput');
    const btn = document.querySelector('#add');
    const city = document.querySelector('#cityoutput');
    const weatherIcon = document.querySelector('#weatherIcon');
    const descrip = document.querySelector('#description');
    const temp = document.querySelector('#temp');
    const humidity = document.querySelector('#humidity');
    const pressure = document.querySelector('#pressure');
    const wind = document.querySelector('#wind');
    const forecastContainer = document.querySelector('#forecast');
    const weatherCard = document.querySelector('#weatherCard');
    const forecastSection = document.querySelector('#forecastSection');
    const background = document.querySelector('#background');
    const locationPopup = document.querySelector('#locationPopup');
    const allowLocationBtn = document.querySelector('#allowLocation');
    const denyLocationBtn = document.querySelector('#denyLocation');
    const closePopupBtn = document.querySelector('#closePopup');
    const apik = "bd5e378503939ddaee76f12ad7a97608";
    
    let backgroundCycleInterval;
    let currentCycleIndex = 0;
    const backgroundCycle = ['summer', 'winter', 'rain'];
    let locationPermissionAsked = false;

    function conversion(val) {
      return (val - 273.15).toFixed(0);
    }

    function formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }

    // Popup functions
    function showLocationPopup() {
      locationPopup.classList.remove('hidden');
      locationPermissionAsked = true;
    }

    function hideLocationPopup() {
      locationPopup.classList.add('hidden');
    }

    function requestLocationPermission() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            hideLocationPopup();
            fetchWeatherByCoords(lat, lon);
          },
          (error) => {
            console.error('Geolocation error:', error);
            hideLocationPopup();
            startBackgroundCycle();
            alert('Unable to access your location. You can still search for cities manually!');
          }
        );
      } else {
        hideLocationPopup();
        startBackgroundCycle();
        alert('Geolocation is not supported by your browser. You can search for cities manually!');
      }
    }

    function stopBackgroundCycle() {
      if (backgroundCycleInterval) {
        clearInterval(backgroundCycleInterval);
        backgroundCycleInterval = null;
      }
    }

    function startBackgroundCycle() {
      // Stop any existing cycle
      stopBackgroundCycle();
      
      // Set initial background
      updateCycleBackground();
      
      // Start cycling every 5 seconds
      backgroundCycleInterval = setInterval(() => {
        currentCycleIndex = (currentCycleIndex + 1) % backgroundCycle.length;
        updateCycleBackground();
      }, 5000);
    }

    function updateCycleBackground() {
      const bg = background;
      const cycleType = backgroundCycle[currentCycleIndex];
      
      // Remove all existing classes and effects
      bg.className = 'background';
      bg.innerHTML = '';

      // Apply theme class to body based on background type
      document.body.className = '';
      
      switch (cycleType) {
        case 'summer':
          bg.classList.add('bg-summer');
          document.body.classList.add('warm-theme');
          createSunshine();
          break;
        case 'winter':
          bg.classList.add('bg-winter');
          document.body.classList.add('cool-theme');
          createSnow();
          break;
        case 'rain':
          bg.classList.add('bg-rain');
          document.body.classList.add('dark-theme');
          createRain();
          break;
      }
    }

    function updateBackground(weatherCondition) {
      // Stop the cycling background when weather is fetched
      stopBackgroundCycle();
      
      const bg = background;
      
      // Remove all existing classes and effects
      bg.className = 'background';
      bg.innerHTML = '';

      // Remove existing theme classes
      document.body.className = '';

      const condition = weatherCondition.toLowerCase();

      if (condition.includes('clear') || condition.includes('sun')) {
        bg.classList.add('bg-clear');
        document.body.classList.add('light-theme');
        createSunshine();
      } else if (condition.includes('cloud')) {
        bg.classList.add('bg-clouds');
        document.body.classList.add('cool-theme');
        createClouds();
      } else if (condition.includes('rain') || condition.includes('drizzle')) {
        bg.classList.add('bg-rain');
        document.body.classList.add('dark-theme');
        createRain();
      } else if (condition.includes('snow')) {
        bg.classList.add('bg-snow');
        document.body.classList.add('cool-theme');
        createSnow();
      } else if (condition.includes('thunder') || condition.includes('storm')) {
        bg.classList.add('bg-thunderstorm');
        document.body.classList.add('stormy-theme');
        bg.innerHTML = '<div class="lightning"></div>';
        createRain();
        createLightning();
      } else if (condition.includes('mist') || condition.includes('fog') || condition.includes('haze')) {
        bg.classList.add('bg-mist');
        document.body.classList.add('cool-theme');
        bg.innerHTML = '<div class="fog"></div>';
      } else {
        bg.classList.add('bg-clear');
        document.body.classList.add('light-theme');
        createSunshine();
      }
    }

    function createRain() {
      const rain = document.createElement('div');
      rain.className = 'rain';
      
      for (let i = 0; i < 100; i++) {
        const drop = document.createElement('div');
        drop.className = 'rain-drop';
        drop.style.left = Math.random() * 100 + '%';
        drop.style.animationDuration = (Math.random() * 0.5 + 0.5) + 's';
        drop.style.animationDelay = Math.random() * 2 + 's';
        rain.appendChild(drop);
      }
      
      background.appendChild(rain);
    }

    function createSnow() {
      const snow = document.createElement('div');
      snow.className = 'snow';
      
      for (let i = 0; i < 50; i++) {
        const flake = document.createElement('div');
        flake.className = 'snowflake';
        flake.innerHTML = '❄';
        flake.style.left = Math.random() * 100 + '%';
        flake.style.animationDuration = (Math.random() * 3 + 2) + 's';
        flake.style.animationDelay = Math.random() * 5 + 's';
        flake.style.fontSize = (Math.random() * 1 + 0.5) + 'rem';
        flake.style.opacity = Math.random();
        snow.appendChild(flake);
      }
      
      background.appendChild(snow);
    }

    function createSunshine() {
      const sunshine = document.createElement('div');
      sunshine.className = 'sunshine';
      
      // Create sun rays
      for (let i = 0; i < 12; i++) {
        const ray = document.createElement('div');
        ray.className = 'sun-ray';
        ray.style.transform = `rotate(${i * 30}deg)`;
        ray.style.animationDelay = `${i * 0.1}s`;
        sunshine.appendChild(ray);
      }
      
      // Create floating particles
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'sun-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 4 + 3) + 's';
        particle.style.animationDelay = Math.random() * 3 + 's';
        sunshine.appendChild(particle);
      }
      
      background.appendChild(sunshine);
    }

    function createClouds() {
      const cloudsContainer = document.createElement('div');
      cloudsContainer.className = 'clouds-container';
      
      for (let i = 0; i < 5; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        cloud.style.top = Math.random() * 40 + 10 + '%';
        cloud.style.left = -20 + '%';
        cloud.style.animationDuration = (Math.random() * 20 + 15) + 's';
        cloud.style.animationDelay = Math.random() * 10 + 's';
        cloud.style.transform = `scale(${Math.random() * 0.5 + 0.8})`;
        cloudsContainer.appendChild(cloud);
      }
      
      background.appendChild(cloudsContainer);
    }

    function createLightning() {
      const lightningContainer = document.createElement('div');
      lightningContainer.className = 'lightning-container';
      
      // Create multiple lightning bolts
      for (let i = 0; i < 3; i++) {
        const bolt = document.createElement('div');
        bolt.className = 'lightning-bolt';
        bolt.style.left = Math.random() * 80 + 10 + '%';
        bolt.style.animationDelay = Math.random() * 3 + 's';
        lightningContainer.appendChild(bolt);
      }
      
      background.appendChild(lightningContainer);
    }

    function fetchWeather(cityName) {
      btn.innerHTML = '<span class="loading"></span>';
      btn.disabled = true;

      fetch('https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + apik)
        .then(response => {
          if (!response.ok) {
            throw new Error('City not found');
          }
          return response.json();
        })
        .then(data => {
          const nameVal = data.name;
          const description = data.weather[0].description;
          const icon = data.weather[0].icon;
          const temperature = data.main.temp;
          const humidityVal = data.main.humidity;
          const pressureVal = data.main.pressure;
          const windSpeed = data.wind.speed;

          // Update background based on weather
          updateBackground(description);

          city.innerHTML = nameVal;
          weatherIcon.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
          temp.innerHTML = `${conversion(temperature)}°C`;
          descrip.innerHTML = description;
          humidity.innerHTML = `${humidityVal}%`;
          pressure.innerHTML = `${pressureVal}<br><small style="font-size: 0.75rem; font-weight: 400;">hPa</small>`;
          wind.innerHTML = `${windSpeed}<br><small style="font-size: 0.75rem; font-weight: 400;">km/h</small>`;

          weatherCard.classList.remove('hidden');

          return fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&appid=' + apik);
        })
        .then(response => response.json())
        .then(data => {
          forecastContainer.innerHTML = '';
          for (let i = 0; i < data.list.length; i += 8) {
            const day = data.list[i];
            const date = formatDate(day.dt_txt);
            const icon = day.weather[0].icon;
            const temperature = conversion(day.main.temp);
            const desc = day.weather[0].description;

            forecastContainer.innerHTML += `
              <div class="forecast-day">
                <h3>${date}</h3>
                <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather Icon">
                <p class="forecast-temp">${temperature}°C</p>
                <p class="forecast-description">${desc}</p>
              </div>
            `;
          }
          forecastSection.classList.remove('hidden');
        })
        .catch(err => {
          alert('City not found. Please check the spelling and try again.');
          console.error('Error:', err);
        })
        .finally(() => {
          btn.innerHTML = 'Search';
          btn.disabled = false;
        });
    }

    function fetchWeatherByCoords(lat, lon) {
      btn.disabled = true;

      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apik}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Unable to fetch weather');
          }
          return response.json();
        })
        .then(data => {
          const nameVal = data.name;
          const description = data.weather[0].description;
          const icon = data.weather[0].icon;
          const temperature = data.main.temp;
          const humidityVal = data.main.humidity;
          const pressureVal = data.main.pressure;
          const windSpeed = data.wind.speed;

          // Update background based on weather
          updateBackground(description);

          city.innerHTML = nameVal + ' 📍';
          weatherIcon.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
          temp.innerHTML = `${conversion(temperature)}°C`;
          descrip.innerHTML = description;
          humidity.innerHTML = `${humidityVal}%`;
          pressure.innerHTML = `${pressureVal}<br><small style="font-size: 0.75rem; font-weight: 400;">hPa</small>`;
          wind.innerHTML = `${windSpeed}<br><small style="font-size: 0.75rem; font-weight: 400;">km/h</small>`;

          weatherCard.classList.remove('hidden');

          return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apik}`);
        })
        .then(response => response.json())
        .then(data => {
          forecastContainer.innerHTML = '';
          for (let i = 0; i < data.list.length; i += 8) {
            const day = data.list[i];
            const date = formatDate(day.dt_txt);
            const icon = day.weather[0].icon;
            const temperature = conversion(day.main.temp);
            const desc = day.weather[0].description;

            forecastContainer.innerHTML += `
              <div class="forecast-day">
                <h3>${date}</h3>
                <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather Icon">
                <p class="forecast-temp">${temperature}°C</p>
                <p class="forecast-description">${desc}</p>
              </div>
            `;
          }
          forecastSection.classList.remove('hidden');
        })
        .catch(err => {
          alert('Unable to fetch weather data for your location.');
          console.error('Error:', err);
        })
        .finally(() => {
          btn.disabled = false;
        });
    }

    inputvalue.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        btn.click();
      }
    });

    btn.addEventListener('click', function() {
      const cityName = inputvalue.value.trim();
      if (!cityName) {
        alert('Please enter a city name');
        return;
      }
      fetchWeather(cityName);
    });

    // Popup event listeners
    allowLocationBtn.addEventListener('click', function() {
      requestLocationPermission();
    });

    denyLocationBtn.addEventListener('click', function() {
      hideLocationPopup();
      startBackgroundCycle();
    });

    closePopupBtn.addEventListener('click', function() {
      hideLocationPopup();
      startBackgroundCycle();
    });

    // Close popup when clicking outside
    locationPopup.addEventListener('click', function(e) {
      if (e.target === locationPopup) {
        hideLocationPopup();
        startBackgroundCycle();
      }
    });

    // Show location popup on page load
    window.addEventListener('load', function() {
      // Set initial theme
      document.body.classList.add('dark-theme');
      
      // Show popup after a short delay for better UX
      setTimeout(() => {
        if (!locationPermissionAsked) {
          showLocationPopup();
        }
      }, 1500);
      
      // Start background cycle initially
      startBackgroundCycle();
    });
