// Global variables
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

// Function for initial page load
var loadLists = function() {
    
    savedCities = JSON.parse(savedCities);
    // condition to check if there are values in local storage
    if(savedCities != null) {
        flag = true;
        // call function for display list of searched city names
        createList();
    }
    else {
        savedCities =[];
    }   
};

// Function for display list of searched city names
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

// Function for searching city name
var inputClickHandler = function(event) {
   
    // prevent page from refreshing
    event.preventDefault();
  
    // get value from input element
    var cityName = userTextEl.value.trim();
    
    if (cityName) {   
        // call function to get the latitude and longitude values 
        getCurrentWeatherByCity(cityName);
  
        // clear old content
        while (forecastContainerEl.firstChild) {
            forecastContainerEl.removeChild(forecastContainerEl.firstChild);
        }
        currentCityEl.textContent = '';
        userTextEl.value = '';
    } else {
      alert('Please enter a valid city name');
    }
};

// Function for searching city name from the saved list
var savedCityWeather = function(event) {
    if(flag === true) {
        var cityName = event.target.textContent;
        if (cityName) {    
            // call function to get weather data 
            getCurrentWeatherByCity(cityName);
      
            // clear old content
            currentCityEl.textContent = '';
            userTextEl.value = '';
        } else {
          alert('Please enter a valid city name');
        }
    }
};


// Function for getting the weather data
var getCurrentWeatherByCity = function(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=7b411f46f5f80992ca33f703bb9e703f";
    fetch(apiUrl)
    .then(function(response) {
        // request was successful
        if (response.ok) {
          response.json().then(function(data) {
            // call function for displaying weather data in elements  
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

// Function for displaying city name and saved cities
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
        // add saved city to the list for displaying
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
    // call function to get current and forecast weather data
    getCurrentWeatherForecast(longitude,latitude);
};

// Function to get current and forecast weather data
var getCurrentWeatherForecast = function(longitude,latitude) {

    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude +"&exclude=minutely,hourly,alerts&units=imperial&appid=7b411f46f5f80992ca33f703bb9e703f";
    fetch(apiUrl)
    .then(function(response) {
        // request was successful
        if (response.ok) {
          response.json().then(function(data) {
            // call function to display current and forecast weather
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

// Function to display current and forecast weather
var displayWeather = function(forecast) {
    // current date
    var unixTimestamp = forecast.current.dt;
    var dateObj = new Date(unixTimestamp * 1000);
    var currentDate = dateObj.toLocaleDateString();  
    var currentCity = currentCityEl.textContent.concat(" (" + currentDate + ")");
    currentCityEl.textContent = currentCity;

    // current weaather condition icon
    var iconCode = forecast.current.weather[0].icon;
    var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";
    currentIconEl.innerHTML = ("<img class = 'current-img' src='" + iconUrl + "'>");

    // current temperature, humidity, wind speed, uvi
    currentTempEl.textContent = forecast.current.temp + "\xB0F";
    currentHumiEl.textContent = forecast.current.humidity + "%";
    currentWindEl.textContent = forecast.current.wind_speed + "mph";
    currentUviEl.textContent = forecast.current.uvi;
    var uvi = forecast.current.uvi;
    // condition for styling uvi data
    if(uvi >= 0 && uvi <= 2){
        currentUviEl.setAttribute("style", "background-color: green");
    }
    else if(uvi >= 3 && uvi <= 5) {
        currentUviEl.setAttribute("style", "background-color: yellow");
    }
    else if(uvi >= 6 && uvi <= 7){
        currentUviEl.setAttribute("style", "background-color: orange");
    }
    else if(uvi >= 8 && uvi <= 10){
        currentUviEl.setAttribute("style", "background-color: red");
    }
    else if(uvi >= 11){
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

        // forecast date
        var dateEl = document.createElement('div');
        dateEl.className = "date";
        rowEl.appendChild(dateEl);
        var unixTimestamp = forecast.daily[i].dt;
        var dateObj = new Date(unixTimestamp * 1000);
        var forecastDate = dateObj.toLocaleDateString();
        dateEl.textContent = forecastDate;
        
        // forecast icon
        var iconEl = document.createElement('div');
        iconEl.className = "icon";
        rowEl.appendChild(iconEl);
        var iconCode = forecast.daily[i].weather[0].icon;
        var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";
        iconEl.innerHTML = ("<img src='" + iconUrl + "'>");
        
        // forecast temperature
        var tempEl = document.createElement('div');
        tempEl.className = "temp";
        rowEl.appendChild(tempEl);
        tempEl.innerHTML = "Temp: " + forecast.daily[i].temp.day + "\xB0F";

        // forecast humidity
        var humiEl = document.createElement('div');
        humiEl.className = "humi";
        rowEl.appendChild(humiEl);
        humiEl.innerHTML = "Humidity: " + forecast.daily[i].humidity + "%";
    }
};

// Function for initial page load    
loadLists();

// add event listener to city input element
searchEl.addEventListener('click', inputClickHandler);
// add event listerner for saved city list
savedcityContainerEl.addEventListener('click', savedCityWeather);

