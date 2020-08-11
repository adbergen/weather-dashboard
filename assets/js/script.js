$(document).ready(function () {

  var citySearched = "";

  var userCity = $("user-city");
  var searchCity = $("search-city");
  var clearHistory = $("clear-history");
  var currentCity = $("")



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
