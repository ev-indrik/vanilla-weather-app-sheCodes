// Current time and date

let apiKey = "e198a574d16b9223ea11e9b7c93f17a0";

let now = new Date();

let hours = now.getHours();
let minutes = now.getMinutes();
let timeNow = "Time: " + hours + ":" + minutes;
let date = now.getDate();

let weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let dayNow = weekDays[now.getDay()];

let months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
let monthNow = months[now.getMonth()];

let timeSpan = document.querySelector("#timeSpan");
timeSpan.innerHTML = timeNow;

let dayWeekSpan = document.querySelector("#daySpan");
dayWeekSpan.innerHTML = dayNow;

let monthSpan = document.querySelector("#monthSpan");
monthSpan.innerHTML = monthNow;

let dateSpan = document.querySelector("#dateSpan");
dateSpan.innerHTML = date;

let celsiusGlobal = null;

//Forecast staff

let longitude = null;
let latitude = null;

//Forecast for gps

function displayForecastGps(gpsInfoArray) {
  let forecastData = gpsInfoArray.data.daily;

  let forecastElement = document.querySelector("#forecast-section");

  function formatDate(timestamp) {
    let date = new Date(timestamp * 1000);
    let day = date.getDay();
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let forecastDays = days[day];

    return forecastDays;
  }

  let forecastHTML = `<div class="row">`;

  forecastData.forEach(function (forecastDay, index) {
    if (index > 0 && index < 7) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2 temp-item">
          <span class="forecast-weather-max">${Math.round(
            forecastDay.temp.max
          )}</span>°
          <span class="forecast-weather-min">${Math.round(
            forecastDay.temp.min
          )}</span>°C<br />
          <img src="https://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png" alt="" width="46" />
          <br />
          ${formatDate(forecastDay.dt)}
        </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

// City change and temp change according GPS

function showTemp(locationInfo) {
  fahrenheitMark.classList.remove("active");
  celsiusMark.classList.add("active");

  let humidityElement = document.querySelector("#humidity");
  let h2 = document.querySelector("h2");
  let tempicon = document.querySelector("#mainTemp");
  let iconElement = document.querySelector("#weather-icon");
  let cityChosen = locationInfo.data.name;
  celsiusGlobal = Math.round(locationInfo.data.main.temp);

  h2.innerHTML = cityChosen;
  tempicon.innerHTML = celsiusGlobal;
  humidityElement.innerHTML = `Humidity: ${locationInfo.data.main.humidity} %`;
  windElement.innerHTML = `Windspeed: ${Math.round(
    locationInfo.data.wind.speed
  )} km/h`;
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${locationInfo.data.weather[0].icon}@2x.png`
  );
}

function showMyData(event) {
  event.preventDefault();

  inputButton.value = null;

  navigator.geolocation.getCurrentPosition((currentLocation) => {
    latitude = currentLocation.coords.latitude;
    longitude = currentLocation.coords.longitude;
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    let apiUrlForecast = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(showTemp);
    axios.get(apiUrlForecast).then(displayForecastGps);
  });
}

let locationButton = document.querySelector("#button-currentPosition");
let humidityElement = document.querySelector("#humidity");
let windElement = document.querySelector("#wind");

locationButton.addEventListener("click", showMyData);

// Weather by City name

function showMycityTemp(dataAboutMyCity) {
  fahrenheitMark.classList.remove("active");
  celsiusMark.classList.add("active");

  function displayCityForecast(result) {
    let cityForecast = result.data.daily;

    let forecastElement = document.querySelector("#forecast-section");

    function formatDate(timestamp) {
      let date = new Date(timestamp * 1000);
      let day = date.getDay();
      let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      let forecastDays = days[day];

      return forecastDays;
    }

    let forecastHTML = `<div class="row">`;

    cityForecast.forEach(function (cityForecast, index) {
      if (index > 0 && index < 7) {
        forecastHTML =
          forecastHTML +
          `<div class="col-2 temp-item">
          <span class="forecast-weather-max">${Math.round(
            cityForecast.temp.max
          )}</span>°
          <span class="forecast-weather-min">${Math.round(
            cityForecast.temp.min
          )}</span>°C<br />
          <img src="https://openweathermap.org/img/wn/${
            cityForecast.weather[0].icon
          }@2x.png" alt="" width="46" />
          <br />
          ${formatDate(cityForecast.dt)}
        </div>`;
      }
    });

    forecastHTML = forecastHTML + `</div>`;
    forecastElement.innerHTML = forecastHTML;
  }

  latitude = dataAboutMyCity.data.coord.lat;
  longitude = dataAboutMyCity.data.coord.lon;

  let iconElement = document.querySelector("#weather-icon");
  celsiusByCity = document.querySelector("#mainTemp");

  celsiusGlobal = Math.round(dataAboutMyCity.data.main.temp);

  h2.innerHTML = dataAboutMyCity.data.name;
  celsiusByCity.innerHTML = celsiusGlobal;
  humidityElement.innerHTML = `Humidity: ${dataAboutMyCity.data.main.humidity} %`;
  windElement.innerHTML = `Windspeed: ${Math.round(
    dataAboutMyCity.data.wind.speed
  )} km/h`;
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${dataAboutMyCity.data.weather[0].icon}@2x.png`
  );

  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayCityForecast);
}

function getMyCityWeather(event) {
  event.preventDefault();
  fahrenheitMark.classList.remove("special");
  celsiusMark.classList.add("special");

  let myCity = inputButton.value;
  let apiUrlCity = `https://api.openweathermap.org/data/2.5/weather?q=${myCity}&appid=${apiKey}&units=metric`;

  axios.get(apiUrlCity).then(showMycityTemp);
}

let submitButton = document.querySelector("#button-addon1");
let inputButton = document.querySelector("#inputCity");
let h2 = document.querySelector("h2");

submitButton.addEventListener("click", getMyCityWeather);

// C and F links
let h1 = document.querySelector("#mainTemp");
let celsiusMark = document.querySelector("#celsius");
let fahrenheitMark = document.querySelector("#fahrenheit");
let celsiusValue = document.querySelector("#mainTemp");

function celsiusClick(event) {
  event.preventDefault();
  fahrenheitMark.classList.remove("active");
  celsiusMark.classList.add("active");
  h1.innerHTML = celsiusGlobal;
}

function fahrenheitClick(event) {
  event.preventDefault();

  celsiusMark.classList.remove("active");
  fahrenheitMark.classList.add("active");
  let fahrenheitFinal = Math.round(Number(celsiusGlobal) * 1.8 + 32);
  h1.innerHTML = fahrenheitFinal;
}

celsiusMark.addEventListener("click", celsiusClick);
fahrenheitMark.addEventListener("click", fahrenheitClick);
