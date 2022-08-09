// Current time and date

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

//Forecast
let forecastElement = document.querySelector("#forecast-section");
let forecastDays = ["Wed", "Thu", "Fri", "Sat", "Sun", "Mon"];
let forecastHTML = `<div class="row">`;

forecastDays.forEach(function (day) {
  forecastHTML =
    forecastHTML +
    `<div class="col-2 temp-item">
          <span class="forecast-weather-max">18</span>°
          <span class="forecast-weather-min">16</span>°C<br />
          <img src="./src/media/icons/windy.png" alt="" width="46" />
          <br />
          ${day}
        </div>`;
});

forecastHTML = forecastHTML + `</div>`;
forecastElement.innerHTML = forecastHTML;

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
    let latitude = currentLocation.coords.latitude;
    let longitude = currentLocation.coords.longitude;
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    axios.get(apiUrl).then(showTemp);
  });
}

let apiKey = "e198a574d16b9223ea11e9b7c93f17a0";
let locationButton = document.querySelector("#button-currentPosition");
let humidityElement = document.querySelector("#humidity");
let windElement = document.querySelector("#wind");

locationButton.addEventListener("click", showMyData);

// Weather by City name

function showMycityTemp(dataAboutMyCity) {
  fahrenheitMark.classList.remove("active");
  celsiusMark.classList.add("active");

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
}

function getMyCityWeather(event) {
  event.preventDefault();

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
