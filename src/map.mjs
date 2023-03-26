const backdropMapElement = document.querySelector(".backdrop-map");

let map;

function mapBinder(getData) {
  const coordinates = { lat: 51.505, lon: -0.09 };
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      coordinates.lat = coords.latitude;
      coordinates.lon = coords.longitude;
      showMap(true);
    },
    (err) => {
      showMap();
    }
  );

  function showMarker() {
    L.marker([coordinates.lat, coordinates.lon])
      .addTo(map)
      .bindPopup("You are here.")
      .openPopup();
  }

  function showMap(show = false) {
    showMapBackdrop();
    if (map) {
      if (show) showMarker();
      return;
    }

    map = L.map("map").setView([coordinates.lat, coordinates.lon], 13);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    showMarker();
    map.on("click", ({ latlng }) => {
      getData(`lat=${latlng.lat}&lon=${latlng.lng}`);
      hideMapBackdrop();
    });
  }
}

backdropMapElement.addEventListener("click", (e) => {
  if (!e.target.matches("#map")) {
    hideMapBackdrop();
  }
});

function showMapBackdrop() {
  backdropMapElement.classList.remove("hidden");
}
function hideMapBackdrop() {
  backdropMapElement.classList.add("hidden");
}

export default mapBinder;
