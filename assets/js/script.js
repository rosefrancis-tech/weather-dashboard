var userInputEl = document.querySelector('#user-input');
var userTextEl = document.querySelector('#search-text');
var searchEl = document.querySelector('#search-icon');
var currentCityEl = document.querySelector('#current-city');
var currentDateEl = document.querySelector('.current-date');
var currentIconEl = document.querySelector('.current-icon');
var currentTempEl = document.querySelector('.current-temp');
var currentHumiEl = document.querySelector('.current-humidity');
var currentWindEl = document.querySelector('.current-windspeed');

var inputClickHandler = function(event) {
   
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
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=7b411f46f5f80992ca33f703bb9e703f";
    fetch(apiUrl)
    .then(function(response) {
        // request was successful
        if (response.ok) {
          response.json().then(function(data) {
            console.log(data);
            console.log(data.name);
            displayWeather(data); 
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function(error) {
        alert('Unable to connect to Weather Dashboard');
      });
};


/*document.cookies.set('name', 'value', {
    sameSite: 'none',
    secure: true
  })*/
var displayWeather = function(data) {
    if (data === null) {
        currentCityEl.textContent = 'No city found.';
        return;
    }
    
    currentCityEl.textContent = data.name;
    /*currentDateEl.textContent = "(" + weather.dt.getdate() + ")";
    var iconCode = weather.weather[0].icon;
    console.log(iconCode);
    var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";
    currentIconEl.innerHTML = ("<img src='" + iconUrl + "'>");*/
    currentTempEl.textContent = data.main.temp + "\xB0F";
    currentHumiEl.textContent = data.main.humidity + "%";
    currentWindEl.textContent = data.wind.speed + "mph";
    var longitude = data.coord.lon;
    var latitude = data.coord.lat;

    getCurrentWeatherForecast(longitude,latitude);
};

var getCurrentWeatherForecast = function(longitude,latitude) {
    console.log(longitude);
    console.log(latitude);
}


// add event listeners to city input element
searchEl.addEventListener('click', inputClickHandler);