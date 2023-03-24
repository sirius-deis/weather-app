const APIKEY = "35c0e6ebf18a5cd5cf5d75725c74b190";
const APIURL = `https://api.openweathermap.org/data/2.5/weather?cords&units=metric&appid={API key}`;
const cityInputElement = document.querySelector(".top__city"),
  geoElement = document.querySelector(".top__gps"),
  btnInputElement = document.querySelector(".top__btn"),
  dateElement = document.querySelector(".date"),
  dayElement = document.querySelector(".day"),
  actualTElement = document.querySelector(".actual b span"),
  fillTElement = document.querySelector(".fill span"),
  centerElement = document.querySelector(".center"),
  sunriseElement = document.querySelector(".sunrise span"),
  sunsetElement = document.querySelector(".sunset span"),
  humidityElement = document.querySelector(".humidity span"),
  windElement = document.querySelector(".wind span"),
  cardinalPointsElement = document.querySelector(".cardinal-points span"),
  pressureElement = document.querySelector(".pressure span");

async function getWeather(cords) {
  try {
    const url = APIURL.replace("cords", cords).replace("{API key}", APIKEY);
    const response = await fetch(url);
    const data = await response.json();
    updateInfo(data);
  } catch (err) {
    console.log(err);
  }
}

function updateInfo({ main, weather, wind, dt, sys, name }) {
  console.log(weather, wind, dt, sys, name);
  actualTElement.textContent = main.temp;
  fillTElement.textContent = main.feels_like;
  centerElement.textContent = weather[0].description;
  centerElement.style.backgroundImage = `url(assets/icons/bg/${weather[0].icon}.png)`;

  const sunRise = new Date(sys.sunrise * 1000);
  sunriseElement.textContent = `${sunRise.getHours()}:${sunRise.getMinutes()}`;
  const sunSet = new Date(sys.sunset * 1000);
  sunsetElement.textContent = `${sunSet.getHours()}:${sunSet.getMinutes()}`;
  pressureElement.textContent = `${main.pressure}mb`;
  humidityElement.textContent = `${main.humidity}%`;
  windElement.textContent = `${((wind.speed * 3600) / 1000).toFixed(1)}km/h`;
}

btnInputElement.addEventListener("click", () => {
  const cityName = cityInputElement.value;
  getWeather(`q=${cityName}`);
});

geoElement.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      getWeather(`lat=${coords.latitude}&lon=${coords.longitude}`);
    },
    (err) => {
      console.log(err);
    }
  );
});
