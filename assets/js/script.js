// variables for pulled data
var searchCity = $("#search-city");
var currentCity = $("#current-city")
var currentTemp = $("#temperature")
var currentHumid = $("#humidity")
var currentWind = $("#wind-speed")
var currentUV = $("#uv-index")
var searchButton = $("#search-button");
var clearButton = $("#clear-history");
var city = "";
var searchedCity = [];


// click assignments
$("#clear-history").on("click", clearHistory);
$("#search-button").on("click", displayWeather);
$(document).on("click", pastSearch);
$(window).on("load", lastCity);


// api key
var key = "aa6eb45bba8f213cbf9ad5b8d2cb4ccb";

// AJAX call
function currentWeather(city) {

  var weatherqueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + key;

  $.ajax({
    url: weatherqueryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);

    var weatherIcon = response.weather[0].icon;
    var iconurl = "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
    var date = new Date(response.dt * 1000).toLocaleDateString();
    $(currentCity).html(response.name + "(" + date + ")" + "<img src=" + iconurl + ">");

    var tempFahr = (response.main.temp - 273.15) * 1.80 + 32;
    $(currentTemp).html((tempFahr).toFixed(2) + "&#8457");
    $(currentHumid).html(response.main.humidity + "%");

    var windSpeed = response.wind.speed;
    var windmph = (windSpeed * 2.237).toFixed(1);
    $(currentWind).html(windmph + "MPH");

    // display UV Index
    UVIndex(response.coord.lon, response.coord.lat);
    forecast(response.id);
    if (response.cod == 200) {
      searchedCity = JSON.parse(localStorage.getItem("cityname"));
      console.log(searchedCity);
      if (searchedCity == null) {
        searchedCity = [];
        searchedCity.push(city.toUpperCase()
        );
        localStorage.setItem("cityname", JSON.stringify(searchedCity));
        toHistory(city);
      }
      else {
        if (find(city) > 0) {
          searchedCity.push(city.toUpperCase());
          localStorage.setItem("cityname", JSON.stringify(searchedCity));
          toHistory(city);
        }
      }
    }
  });
}

// display weather function
function displayWeather(event) {
  event.preventDefault();
  if (searchCity.val().trim() !== "") {
    city = searchCity.val().trim();
    currentWeather(city);
  }
}

// verify city
function find(c) {
  for (var i = 0; i < searchedCity.length; i++) {
    if (c.toUpperCase() === searchedCity[i]) {
      return -1;
    }
  }
  return 1;
}

// uv index response
function UVIndex(ln, lt) {
  var uvqURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + key + "&lat=" + lt + "&lon=" + ln;
  $.ajax({
    url: uvqURL,
    method: "GET"
  }).then(function (response) {
    console.log(response)
    $(currentUV).html(response.value);
  });
}

// 5 day forecast
function forecast(cityid) {
  var forecastqueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityid + "&appid=" + key;
  $.ajax({
    url: forecastqueryURL,
    method: "GET"
  }).then(function (response) {
    console.log(response);
    for (i = 0; i < 5; i++) {
      var date = new Date((response.list[((i + 1) * 8) - 1].dt) * 1000).toLocaleDateString();
      var iconCode = response.list[((i + 1) * 8) - 1].weather[0].icon;
      var iconurl = "https://openweathermap.org/img/wn/" + iconCode + ".png";
      var tempK = response.list[((i + 1) * 8) - 1].main.temp;
      var tempFahr = (((tempK - 273.5) * 1.80) + 32).toFixed(2);
      var humidity = response.list[((i + 1) * 8) - 1].main.humidity;
      $("#fDate" + i).html(date);
      $("#fImg" + i).html("<img src=" + iconurl + ">");
      $("#fTemp" + i).html(tempFahr + "&#8457");
      $("#fHumidity" + i).html(humidity + "%");
    }
  });
}

// append/attr city to search history
function toHistory(c) {
  var listEl = $("<li>" + c.toUpperCase() + "</li>");
  $(listEl).attr("class", "list-group-item");
  $(listEl).attr("data-value", c.toUpperCase());
  $(".list-group").append(listEl);
}

//display city when clicked within history
function pastSearch(event) {
  var liEl = event.target;
  if (event.target.matches("li")) {
    city = liEl.textContent.trim();
    currentWeather(city);
  }
}

// add searched city to display weather
function lastCity() {
  $("ul").empty();
  var searchedCity = JSON.parse(localStorage.getItem("cityname"));
  if (searchedCity !== null) {
    searchedCity = JSON.parse(localStorage.getItem("cityname"));
    for (i = 0; i < searchedCity.length; i++) {
      toHistory(searchedCity[i]);
    }
    city = searchedCity[i - 1];
    currentWeather(city);
  }
}

// clear history
function clearHistory(event) {
  event.preventDefault();
  searchedCity = [];
  localStorage.removeItem("cityname");
  document.location.reload();
}
