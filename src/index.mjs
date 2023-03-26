import ToolTip from "./tooltip.mjs";
import mapBinder from "./map.mjs";
import { updateInfoOnMode, updateInfo, formCards } from "./updateInfoMode.mjs";
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".container"),
    cityInputElement = document.querySelector(".top__city"),
    geoElement = document.querySelector(".top__gps"),
    btnInputElement = document.querySelector(".top__btn"),
    btnMap = document.querySelector(".top__map"),
    bottomElement = document.querySelector(".bottom"),
    dayNightChanger = document.querySelector(".day-night-change"),
    backdropLoaderElement = document.querySelector(".backdrop-loader");

  let data;
  let list;
  let mode = "day";
  let tooltip;

  async function getWeather(cords) {
    showLoaderBackdrop();
    try {
      const response = await fetch(
        `http://localhost:8081/api/v1/weather?${cords}`
      );
      if (!response.ok) throw new Error();
      data = await response.json();
      updateListContent();
      updateInfo(data, list);
    } catch (err) {
      console.log(err);
      getTooltip().show(cityInputElement, "Please enter correct city name");
    }
    hideLoaderBackdrop();
  }

  function updateListContent() {
    list = data.list.filter((date) =>
      date.dt_txt.includes(`${mode === "day" ? "09" : "18"}:00:00`)
    );
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
    if (getTooltip.isShown) tooltip.hide();
  });

  geoElement.addEventListener("click", () => {
    if (getTooltip.isShown) tooltip.hide();
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
    if (!data) return;
    mode = mode === "day" ? "night" : "day";
    this.src = `assets/icons/${mode === "day" ? "sun" : "half-moon"}.png`;
    updateListContent();
    updateInfoOnMode(list);
    formCards(list);
  });

  bottomElement.addEventListener("click", (e) => {
    if (!e.target.closest(".bottom__cell")) return;
    if (list.length === 0) return;
    const time = e.target.closest(".bottom__cell").dataset.dt;
    const index = list.findIndex((el) => el.dt == time);
    updateInfoOnMode(list, index);
  });

  function getTooltip() {
    if (!tooltip) {
      tooltip = new ToolTip(container);
    }
    return tooltip;
  }

  function showLoaderBackdrop() {
    backdropLoaderElement.classList.remove("hidden");
  }

  function hideLoaderBackdrop() {
    backdropLoaderElement.classList.add("hidden");
  }

  btnMap.addEventListener("click", () => {
    mapBinder(getWeather);
  });
});
