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
var forecastContainerEl = document.getElementById("forecast-container");
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
    var showCurrentLocation = confirm("Allow ");
    if(showCurrentLocation === true) {
        getLocation();
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
        while (forecastContainerEl.firstChild) {
            forecastContainerEl.removeChild(forecastContainerEl.firstChild);
        }
        //forecastContainerEl.removeChild();
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
    var flag2 = false;
    // avoid saving duplicate city names
    for (var k=0; k < savedCities.length; k++) {
        if(data.name === savedCities[k]) {
            flag2 = true;
        }
    }
    if (flag2 === false) {
        savedCities.push(data.name);
        // replace with fn
        var savedcityRowEl = document.createElement('div');
        savedcityRowEl.className = "row";
        savedcityContainerEl.appendChild(savedcityRowEl);
    
        var savedcityColEl = document.createElement('div');
        savedcityColEl.classList = "col favourite";
        savedcityColEl.textContent = data.name;
        savedcityRowEl.appendChild(savedcityColEl);

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
        if(uvi >= 0 && uvi <= 2){
            currentUviEl.setAttribute("style", "background-color: green");
        }
        if(uvi >= 3 && uvi <= 5) {
            currentUviEl.setAttribute("style", "background-color: yellow");
        }
        if(uvi >= 6 && uvi <= 7){
            currentUviEl.setAttribute("style", "background-color: orange");
        }
        if(uvi >= 8 && uvi <= 10){
            currentUviEl.setAttribute("style", "background-color: red");
        }
        if(uvi >= 11){
            currentUviEl.setAttribute("style", "background-color: violet");
        }
               
    // forecast weather
    

    var forecastCardEl = document.createElement('div');
    forecastCardEl.className = "row";
    forecastCardEl.setAttribute("id", "forecast-card");
    forecastContainerEl.appendChild(forecastCardEl);
    
    for(var i = 1; i <= 5; i++) {
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


      
var getLocation = function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else { 
        alert("Geolocation is not supported by this browser.");
    }
};

var showPosition = function(position) {
    alert("Latitude: " + position.coords.latitude + "Longitude: " + position.coords.longitude);
};

var showError = function(error) {
    switch(error.code) {
    case error.PERMISSION_DENIED:
        alert("User denied the request for Geolocation.");
        break;
    case error.POSITION_UNAVAILABLE:
        alert(x.innerHTML = "Location information is unavailable.");
        break;
    case error.TIMEOUT:
        alert("The request to get user location timed out.");
        break;
    case error.UNKNOWN_ERROR:
        alert("An unknown error occurred.");
        break;
    }
};
        

loadLists();
// add event listeners to city input element
searchEl.addEventListener('click', inputClickHandler);

savedcityContainerEl.addEventListener('click', savedCityWeather);

