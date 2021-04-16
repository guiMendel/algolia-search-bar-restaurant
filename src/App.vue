<template>
  <div class="container">
    <!-- buttons -->
    <div class="buttons">
      <circle-button
        class="toggle-NY-coords"
        :class="{ active: !useNYcoords, disabled: !coords }"
        @click="useNYcoords = !useNYcoords"
        :icon="locationIcon"
        :hoverMessage="locationHoverMessage"
      />
      <circle-button
        class="toggle-map"
        :class="{ active: showMap, disabled: !showMap && !coords }"
        @click="showMap = coords && !showMap"
        icon="map"
        hoverMessage="Show map"
      />
    </div>

    <!-- search bar -->
    <search-bar
      @result="handleResults"
      :coords="coords"
      placeholder="search by name, cuisine or location"
    />

    <div class="results">
      <!-- number of results message -->
      <p class="number-of-results">
        {{ numberOfResults }}
      </p>

      <!-- results -->
      <restaurant-index :coords="coords" :restaurants="results?.hits" />
    </div>

    <!-- map -->
    <transition name="slide">
      <Map
        v-show="showMap || screenWidth >= 1024"
        class="map"
        :coords="coords"
        :pins="restaurantLocations"
      />
    </transition>

    <!-- footer with additional messages -->
    <p v-if="locationMessage" class="location-message">
      {{ locationMessage }}
    </p>
  </div>
</template>

<script>
import CircleButton from "./components/CircleButton.vue"
import SearchBar from "./components/SearchBar.vue"
import Map from "./components/Map.vue"
import RestaurantIndex from "./views/RestaurantIndex.vue"

export default {
  name: "App",
  components: {
    RestaurantIndex,
    SearchBar,
    CircleButton,
    Map,
  },
  data: () => ({
    results: null,
    coords: null,
    useNYcoords: false,
    showMap: false,
    screenWidth: window.innerWidth,
  }),
  computed: {
    numberOfResults() {
      if (!this.results) return ""
      return `
          ${
            this.results.nbHits > 999
              ? Math.round(this.results.nbHits / 1000) + "k"
              : this.results.nbHits
          } ${this.results.nbHits > 1 ? "results" : "result"} found in ${
        this.results.processingTimeMS > 99
          ? this.results.processingTimeMS / 1000.0 + " s"
          : this.results.processingTimeMS + " ms"
      }`
    },
    locationIcon() {
      if (this.useNYcoords) return "gps_off"
      else if (this.coords) return "gps_fixed"
      else return "gps_not_fixed"
    },
    locationHoverMessage() {
      if (this.useNYcoords) return "Simulating location from New York"
      else if (this.coords) return "Using real geolocation"
      else return "No location access"
    },
    locationMessage() {
      if (this.useNYcoords) return "Simulating location from New York"
      else if (!this.coords) return "Failed to retrieve current location"
      else return ""
    },
    restaurantLocations() {
      if (!this.results) return []
      return this.results.hits.map(
        ({ objectID: id, _geoloc: { lat, lng } }) => ({
          id,
          location: { lat, lng },
        }),
      )
    },
  },
  methods: {
    handleResults(results) {
      this.results = results
      // console.log(results)
      console.log(this.screenWidth)
    },
    getLocation() {
      // Get user's location
      navigator?.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) =>
          (this.coords = { latitude, longitude }),
        // On error, erase coords
        () => (this.coords = null),
      )
    },
  },
  created() {
    this.getLocation()

    // Listen to changes in screen width
    window.addEventListener("resize", () => {
      this.screenWidth = window.innerWidth
    })
  },
  watch: {
    useNYcoords(use) {
      if (use) {
        this.coords = {
          latitude: 40.71,
          longitude: -74.012,
        }
      } else {
        this.getLocation()
      }
    },
  },
}
</script>

<style scoped>
.container {
  width: 100%;

  display: flex;
  justify-content: center;
}

.map {
  position: fixed;

  width: 120%;
  height: 110%;
}

.number-of-results {
  margin-top: 0.5rem;
  color: var(--text-light);
  font-weight: 300;

  width: max-content;
}

.buttons {
  z-index: 100;

  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.5rem;

  position: fixed;
  bottom: 4rem;
  right: 2rem;
}

.buttons > *.active {
  color: var(--blue);
}

.buttons > *.disabled {
  color: var(--light-gray);
  background: var(--gray);
}

.results {
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;

  padding-top: 8rem;
  padding-bottom: 8rem;
}

.location-message {
  z-index: 100;

  position: fixed;
  bottom: 0;

  background: var(--background);

  width: 100%;
  color: var(--gray);
  font-weight: 600;

  padding: 0.5rem 0;

  box-shadow: 0 0 10px 0.5px rgba(24, 24, 26, 0.2);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 300ms ease-out;
}

.slide-enter-from,
.slide-leave-to {
  transform: translate(100%);
}

@media (min-width: 650px) {
  .results {
    padding-top: 9rem;
  }
}
@media (min-width: 850px) {
  .buttons {
    flex-direction: column-reverse;
  }

  .number-of-results {
    font-size: 1.3rem;
    margin: 1.3rem 0;
  }

  .location-message {
    right: 0;
    width: max-content;

    color: var(--text);

    padding: 0.5rem 1rem;
    border-radius: 20px 0 0 0;
  }
}

@media (min-width: 850px) {
  .map {
    z-index: 5;
    position: sticky;
    top: 0;
    height: 100vh;

    width: 100%;
  }

  .results {
    z-index: 10;

    min-width: 38rem;
    box-shadow: 0 0 80px 50px rgba(24, 24, 26, 0.1);
  }
}
</style>
