document.addEventListener("DOMContentLoaded", () => {
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
    pressureElement = document.querySelector(".pressure span"),
    bottomElement = document.querySelector(".bottom"),
    dayNightChanger = document.querySelector(".day-night-change"),
    cellTemplate = document.querySelector(".cell-template"),
    backdropElement = document.querySelector(".backdrop");

  let data;
  let list;
  let mode = "day";

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  async function getWeather(cords) {
    showBackdrop();
    try {
      const response = await fetch(
        `http://localhost:8081/api/v1/weather?${cords}`
      );
      data = await response.json();
      updateListContent();
      updateInfo();
    } catch (err) {
      console.error(err);
    }
    hideBackdrop();
  }

  function updateListContent() {
    list = data.list.filter((date) =>
      date.dt_txt.includes(`${mode === "day" ? "09" : "18"}:00:00`)
    );
  }

  function updateInfo() {
    if (cityInputElement.value != data.city.name) {
      cityInputElement.value = data.city.name;
    }
    const sunriseTime = new Date(data.city.sunrise * 1000);
    const sunsetTime = new Date(data.city.sunset * 1000);
    sunriseElement.textContent = `${sunriseTime.getHours()}:${sunriseTime.getMinutes()}`;
    sunsetElement.textContent = `${sunsetTime.getHours()}:${sunsetTime.getMinutes()}`;

    updateInfoOnMode();
    formCards();
  }

  function updateInfoOnMode(n = 0) {
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
    if (data === undefined) return;
    const dateTime = new Date(list[0].dt * 1000);
    dateElement.textContent = `${
      months[dateTime.getUTCMonth()]
    } ${dateTime.getDate()}`;
    dayElement.textContent = `${days[dateTime.getDay() - 1]}`;

    actualTElement.textContent = list[0].main.temp.toFixed(1);
    fillTElement.textContent = list[0].main.feels_like.toFixed(1);
    centerElement.firstChild.textContent = list[0].weather[0].description;
    centerElement.style.backgroundImage = `url(assets/icons/bg/${list[0].weather[0].icon.replace(
      "n",
      "d"
    )}.png)`;
    humidityElement.textContent = `${list[0].main.humidity}%`;
    windElement.textContent = `${list[0].wind.speed}km/h`;
    const deg = list[0].wind.deg;
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
    pressureElement.textContent = `${list[0].main.pressure.toFixed(1)}mb`;
  }

  function formCards() {
    bottomElement.innerHTML = "";
    const elements = list.map((el) => {
      const clone = cellTemplate.content.cloneNode(true);
      const img = clone.querySelector("img");
      img.src = `https://openweathermap.org/img/wn/${el.weather[0].icon.replace(
        "n",
        "d"
      )}@2x.png`;

      img.alt = el.weather[0].description;
      const date = new Date(el.dt * 1000);
      clone.querySelector(".bottom__day").textContent = `${
        days[date.getDay()]
      }`;
      clone.querySelector(".bottom__temperature").textContent =
        el.main.temp.toFixed(1);
      return clone;
    });
    bottomElement.append(...elements);
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
        console.error(err);
      }
    );
  });

  dayNightChanger.addEventListener("click", function () {
    mode = mode === "day" ? "night" : "day";
    this.src = `assets/icons/${mode === "day" ? "sun" : "half-moon"}.png`;
    updateListContent();
    updateInfoOnMode();
    formCards();
  });

  function showBackdrop() {
    backdropElement.classList.remove("hidden");
  }

  function hideBackdrop() {
    backdropElement.classList.add("hidden");
  }
});
