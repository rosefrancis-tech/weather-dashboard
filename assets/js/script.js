

var getCurrentWeatherByCity = function(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=7b411f46f5f80992ca33f703bb9e703f";
    fetch(apiUrl)
    .then(function(response) {
        // request was successful
        if (response.ok) {
          console.log(response);
          response.json().then(function(data) {
            console.log(data);
            //displayRepos(data, user);
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function(error) {
        alert('Unable to connect to GitHub');
      });
};

getCurrentWeatherByCity("Paris");