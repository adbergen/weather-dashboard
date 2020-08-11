$(document).ready(function () {

  // stored searches
  var citySearched = "";

  // variables for pulled data
  var userCity = $("user-city");
  var searchCity = $("search-city");
  var clearHistory = $("clear-history");
  var currentCity = $("current-city")
  var currentTemp = $("current-temp")
  var currentHumid = $("current-humid")
  var currentWind = $("current-wind")
  var currentUV = $("current-uv")
  var cities = [];

  // verify city
  function find(c) {
    for (var i = 0; i < cities.length; i++) {
      if (c.toUpperCase() === cities[i]) {
        return -1;
      }
    }
    return 1;
  }

  // search click function
  $("#searchCity").on("click", function (event) {
    event.preventDefault()

    var city = $("#contentInput").val();
    var key = "aa6eb45bba8f213cbf9ad5b8d2cb4ccb"
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + key;

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response) {
      console.log(response);
    });
  });
});
