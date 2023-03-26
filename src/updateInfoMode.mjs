const cityInputElement = document.querySelector(".top__city"),
  dateElement = document.querySelector(".date"),
  dayElement = document.querySelector(".day"),
  actualTElement = document.querySelector(".actual b span"),
  fillTElement = document.querySelector(".fill span"),
  centerElement = document.querySelector(".center"),
  sunsetElement = document.querySelector(".sunset span"),
  sunriseElement = document.querySelector(".sunrise span"),
  humidityElement = document.querySelector(".humidity span"),
  windElement = document.querySelector(".wind span"),
  cardinalPointsElement = document.querySelector(".cardinal-points span"),
  pressureElement = document.querySelector(".pressure span"),
  bottomElement = document.querySelector(".bottom"),
  cellTemplate = document.querySelector(".cell-template");

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function updateInfoOnMode(list, n = 0) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dateTime = new Date(list[n].dt * 1000);
  dateElement.textContent = `${
    months[dateTime.getUTCMonth()]
  } ${dateTime.getDate()}`;
  dayElement.textContent = `${days[dateTime.getDay()]}`;

  actualTElement.textContent = list[n].main.temp.toFixed(1);
  fillTElement.textContent = list[n].main.feels_like.toFixed(1);
  centerElement.firstChild.textContent = list[n].weather[0].description;
  centerElement.style.backgroundImage = `url(assets/icons/bg/${list[
    n
  ].weather[0].icon.replace("n", "d")}.webp)`;
  humidityElement.textContent = `${list[n].main.humidity}%`;
  windElement.textContent = `${list[n].wind.speed}km/h`;
  const deg = list[n].wind.deg;
  let dir;
  if (deg === 0) {
    dir = "North";
  } else if (deg > 0 && deg < 90) {
    dir = "North-East";
  } else if (deg === 90) {
    dir = "East";
  } else if (deg > 90 && deg < 180) {
    dir = "East-South";
  } else if (deg === 180) {
    dir = "South";
  } else if (deg > 180 && deg < 270) {
    dir = "South-West";
  } else if (deg === 270) {
    dir = "West";
  } else {
    dir = "West-North";
  }
  cardinalPointsElement.textContent = dir;
  pressureElement.textContent = `${list[n].main.pressure.toFixed(1)}mb`;
}

function updateInfo(data, list) {
  if (cityInputElement.value != data.city.name) {
    cityInputElement.value = data.city.name;
  }
  const sunriseTime = new Date(data.city.sunrise * 1000);
  const sunsetTime = new Date(data.city.sunset * 1000);
  sunriseElement.textContent = `${sunriseTime.getHours()}:${sunriseTime.getMinutes()}`;
  sunsetElement.textContent = `${sunsetTime.getHours()}:${sunsetTime.getMinutes()}`;
  updateInfoOnMode(list);
  formCards(list);
}

function formCards(list) {
  bottomElement.innerHTML = "";
  const elements = list.map((el) => {
    const clone = cellTemplate.content.cloneNode(true);
    const img = clone.querySelector("img");
    img.src = `https://openweathermap.org/img/wn/${el.weather[0].icon}@2x.png`;

    img.alt = el.weather[0].description;
    const date = new Date(el.dt * 1000);
    clone.querySelector(".bottom__day").textContent = `${days[date.getDay()]}`;
    clone.querySelector(".bottom__temperature").textContent =
      el.main.temp.toFixed(1);
    clone.firstElementChild.dataset.dt = el.dt;
    return clone;
  });
  bottomElement.append(...elements);
}

export { updateInfoOnMode, updateInfo, formCards };
