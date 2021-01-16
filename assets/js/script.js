var userInputEl = document.querySelector('#user-input');
var userTextEl = document.querySelector('#search-text');
var searchEl = document.querySelector('#search-icon');
var currentCityEl = document.querySelector('#current-city');
var currentTempEl = document.querySelector('.current-temp');
var currentHumiEl = document.querySelector('.current-humidity');
var currentWindEl = document.querySelector('.current-windspeed');

var inputClickHandler = function(event) {
    debugger;
    // prevent page from refreshing
    //event.preventDefault();
  
    // get value from input element
    var cityName = userTextEl.value.trim();
  
    if (cityName) {
        getCurrentWeatherByCity(cityName);
  
      // clear old content
      currentCityEl.textContent = '';
      userTextEl.value = '';
    } else {
      alert('Please enter a valid city name');
    }
  };

var getCurrentWeatherByCity = function(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=7b411f46f5f80992ca33f703bb9e703f";
    fetch(apiUrl)
    .then(function(response) {
        // request was successful
        if (response.ok) {
          response.json().then(function(data) {
            console.log(data);
            console.log(data.name);
            displayWeather(data, city);
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function(error) {
        alert('Unable to connect to GitHub');
      });
};

var displayWeather = function(weather,city) {
    if (weather === null) {
        currentCityEl.textContent = 'No city found.';
        return;
    }
    
    currentCityEl.textContent = weather.name;
    currentTempEl.textContent = weather.main.temp;
    currentHumiEl.textContent = weather.main.humidity;
    currentWindEl.textContent = weather.wind.speed;

};

// add event listeners to city input element
searchEl.addEventListener('click', inputClickHandler);