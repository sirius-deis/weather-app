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
    const response = await fetch(
      `http://localhost:8081/api/v1/weather?${cords}`
    );
    const data = await response.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}

function updateInfo() {}

btnInputElement.addEventListener("click", () => {});

geoElement.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      getWeather(`lat=${coords.latitude}&lon=${coords.longitude}`);
    },
    (err) => {
      console.error(err);
    }
  );
});
