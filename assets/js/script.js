var userInputEl = document.querySelector('#user-input');
var userTextEl = document.querySelector('#search-text');
var searchEl = document.querySelector('#search-icon');
var currentCityEl = document.querySelector('#current-city');
var currentDateEl = document.querySelector('.current-date');
var currentIconEl = document.querySelector('.current-icon');
var currentTempEl = document.querySelector('.current-temp');
var currentHumiEl = document.querySelector('.current-humidity');
var currentWindEl = document.querySelector('.current-windspeed');
var currentUviEl = document.querySelector('.current-uvi');
var savedcityContainerEl = document.querySelector('#saved-cities');
var cities = [];
var savedCities = localStorage.getItem("cities");
var flag = false;


var loadLists = function() {
    
    savedCities = JSON.parse(savedCities);
    if(savedCities != null) {
        flag = true;
        createList();
    }
    else {
        savedCities =[];
    }
};

var createList = function() {
    for(var j=0; j < savedCities.length; j ++) {
        
        var savedcityRowEl = document.createElement('div');
        savedcityRowEl.className = "row";
        savedcityContainerEl.appendChild(savedcityRowEl);
    
        var savedcityColEl = document.createElement('div');
        savedcityColEl.classList = "col favourite";
        savedcityColEl.textContent = savedCities[j];
        savedcityRowEl.appendChild(savedcityColEl);
        
    }
};

var inputClickHandler = function(event) {
   
    // prevent page from refreshing
    event.preventDefault();
  
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


var savedCityWeather = function(event) {
    if(flag === true) {
        var cityName = event.target.textContent;
        if (cityName) {    
            getCurrentWeatherByCity(cityName);
      
            // clear old content
            currentCityEl.textContent = '';
            userTextEl.value = '';
        } else {
          alert('Please enter a valid city name');
        }
    }
};



var getCurrentWeatherByCity = function(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=7b411f46f5f80992ca33f703bb9e703f";
    fetch(apiUrl)
    .then(function(response) {
        // request was successful
        if (response.ok) {
          response.json().then(function(data) {
            displayCity(data); 
          });
        } else {
          alert('Error: ' + response.statusText);
        }
    })
    .catch(function(error) {
        alert('Unable to connect to Weather Dashboard');
    });
};


var displayCity = function(data) {
    if (data === null) {
        currentCityEl.textContent = 'No city found.';
        return;
    }
    // display city name
    currentCityEl.textContent = data.name;
    var flag = false;
    // avoid saving duplicate city names
    for (var k=0; k < savedCities.length; k++) {
        if(data.name === savedCities[k]) {
            flag2 = true;
        }
    }
    if (flag === false) {
        savedCities.push(data.name);
    }
    // save city names to local storage
    cities = savedCities;
    localStorage.setItem("cities", JSON.stringify(cities));
    // get latitude and longitude values
    var longitude = data.coord.lon;
    var latitude = data.coord.lat;
    getCurrentWeatherForecast(longitude,latitude);
};

var getCurrentWeatherForecast = function(longitude,latitude) {

    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude +"&exclude=minutely,hourly,alerts&units=imperial&appid=7b411f46f5f80992ca33f703bb9e703f";
    fetch(apiUrl)
    .then(function(response) {
        // request was successful
        if (response.ok) {
          response.json().then(function(data) {
            console.log(data);
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

var displayWeather = function(forecast) {
    // current weather
    var unixTimestamp = forecast.current.dt;
    var dateObj = new Date(unixTimestamp * 1000);
    var currentDate = dateObj.toLocaleDateString();
    //currentDateEl.textContent = "(" + currentDate + ")";
    
    var currentCity = currentCityEl.textContent.concat(" (" + currentDate + ")");
    currentCityEl.textContent = currentCity;

    var iconCode = forecast.current.weather[0].icon;
    //console.log(iconCode);
    var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";
    currentIconEl.innerHTML = ("<img class = 'current-img' src='" + iconUrl + "'>");
    currentTempEl.textContent = forecast.current.temp + "\xB0F";
    currentHumiEl.textContent = forecast.current.humidity + "%";
    currentWindEl.textContent = forecast.current.wind_speed + "mph";
    currentUviEl.textContent = forecast.current.uvi;
    var uvi = forecast.current.uvi;
    console.log(uvi);
    //switch()


    // forecast weather

    for(var i = 1; i <= 5; i++) {

        var forecastCardEl = document.getElementById('forecast-card');
        
        var rowEl = document.createElement('div');
        rowEl.classList = "col-sm forecast-row";
        rowEl.setAttribute("id", "forecast-row");
        forecastCardEl.appendChild(rowEl);

        var dateEl = document.createElement('div');
        dateEl.className = "date";
        rowEl.appendChild(dateEl);
        var unixTimestamp = forecast.daily[i].dt;
        var dateObj = new Date(unixTimestamp * 1000);
        var forecastDate = dateObj.toLocaleDateString();
        dateEl.textContent = forecastDate;
    

        var iconEl = document.createElement('div');
        iconEl.className = "icon";
        rowEl.appendChild(iconEl);
        var iconCode = forecast.daily[i].weather[0].icon;
        var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";
        iconEl.innerHTML = ("<img src='" + iconUrl + "'>");

        var tempEl = document.createElement('div');
        tempEl.className = "temp";
        rowEl.appendChild(tempEl);
        tempEl.innerHTML = "Temp: " + forecast.daily[i].temp.day + "\xB0F";

        var humiEl = document.createElement('div');
        humiEl.className = "humi";
        rowEl.appendChild(humiEl);
        humiEl.innerHTML = "Humidity: " + forecast.daily[i].humidity + "%";
    }
};

loadLists();
// add event listeners to city input element
searchEl.addEventListener('click', inputClickHandler);

savedcityContainerEl.addEventListener('click', savedCityWeather);

