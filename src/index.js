document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".container"),
    cityInputElement = document.querySelector(".top__city"),
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
  let tooltip;

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  function ToolTip() {
    this.toolTip = document.createElement("div");
    this.toolTip.classList.add("tooltip", "hidden");
    this.text = document.createElement("p");
    button = document.createElement("button");
    button.className = "tooltip__close";
    button.innerHTML = "&times;";
    button.addEventListener("click", () => {
      this.hide();
    });
    this.toolTip.append(this.text, button);
    container.append(this.toolTip);
  }

  ToolTip.prototype.hide = function () {
    this.isShown = false;
    this.toolTip.classList.add("hidden");
  };

  ToolTip.prototype.show = function (element, text) {
    const rectEl = element.getBoundingClientRect();
    this.toolTip.classList.remove("hidden");
    const cs = getComputedStyle(this.toolTip);
    this.text.innerText = text;
    this.toolTip.style.top = `${
      element.offsetTop - parseInt(cs.height) - 20
    }px`;
    this.toolTip.style.left = `${
      element.offsetLeft - parseInt(cs.width) / 2 + rectEl.width / 2
    }px`;
    this.isShown = true;
  };

  async function getWeather(cords) {
    showBackdrop();
    try {
      const response = await fetch(
        `http://localhost:8081/api/v1/weather?${cords}`
      );
      if (!response.ok) throw new Error();
      data = await response.json();
      updateListContent();
      updateInfo();
    } catch (err) {
      getTooltip().show(cityInputElement, "Please enter correct city name");
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
    const dateTime = new Date(list[n].dt * 1000);
    dateElement.textContent = `${
      months[dateTime.getUTCMonth()]
    } ${dateTime.getDate()}`;
    dayElement.textContent = `${days[dateTime.getDay() - 1]}`;

    actualTElement.textContent = list[n].main.temp.toFixed(1);
    fillTElement.textContent = list[n].main.feels_like.toFixed(1);
    centerElement.firstChild.textContent = list[n].weather[0].description;
    centerElement.style.backgroundImage = `url(assets/icons/bg/${list[
      n
    ].weather[0].icon.replace("n", "d")}.png)`;
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
      clone.firstElementChild.dataset.dt = el.dt;
      return clone;
    });
    bottomElement.append(...elements);
  }

  btnInputElement.addEventListener("click", () => {
    const cityName = cityInputElement.value;
    if (cityName.trim().length == 0) {
      return getTooltip().show(
        cityInputElement,
        "Input field couldn't be empty"
      );
    }
    getWeather(`q=${cityName}`);
  });

  cityInputElement.addEventListener("focus", () => {
    if (tooltip.isShown) tooltip.hide();
  });

  geoElement.addEventListener("click", () => {
    if (tooltip.isShown) tooltip.hide();
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        getWeather(`lat=${coords.latitude}&lon=${coords.longitude}`);
      },
      (err) => {
        getTooltip().show(
          geoElement,
          "Please enable access to your geolocation"
        );
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

  bottomElement.addEventListener("click", (e) => {
    if (!e.target.closest(".bottom__cell")) return;
    if (list.length === 0) return;
    const time = e.target.closest(".bottom__cell").dataset.dt;
    const index = list.findIndex((el) => el.dt == time);
    updateInfoOnMode(index);
  });

  function getTooltip() {
    if (!tooltip) {
      tooltip = new ToolTip();
    }
    return tooltip;
  }

  function showBackdrop() {
    backdropElement.classList.remove("hidden");
  }

  function hideBackdrop() {
    backdropElement.classList.add("hidden");
  }
});
