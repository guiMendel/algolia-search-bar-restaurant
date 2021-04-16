<template>
  <div class="container">
    <circle-button
      class="toggle-NY-coords"
      :class="{ 'using-geolocation': !useNYcoords, disabled: !coords }"
      @click="useNYcoords = !useNYcoords"
      :icon="locationIcon"
      :hoverMessage="locationHoverMessage"
    />
    <search-bar
      @result="handleResults"
      :coords="coords"
      placeholder="search by name, cuisine or location"
    />
    <Map class="map" :coords="coords" />
    <p class="number-of-results">
      {{ numberOfResults }}
    </p>
    <restaurant-index :coords="coords" :restaurants="results.hits" />
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
    results: {},
    coords: null,
    useNYcoords: false,
  }),
  computed: {
    numberOfResults() {
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
  },
  methods: {
    handleResults(results) {
      this.results = results
      // console.log(results)
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
  },
  watch: {
    useNYcoords(use) {
      if (use) {
        this.coords = {
          latitude: 40.71,
          longitude: -74.01,
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
  flex-direction: column;
  align-items: center;

  padding-bottom: 8rem;
}

.map {
  position: fixed;

  width: 100%;
  height: 100%;
}

.number-of-results {
  margin-top: 0.5rem;
  color: var(--text-light);
  font-weight: 300;
}

.toggle-NY-coords {
  z-index: 100;

  position: fixed;
  bottom: 4rem;
  right: 2rem;
}

.toggle-NY-coords.using-geolocation {
  color: var(--light-gray);
  background: var(--button-back-blue);
}

.toggle-NY-coords.disabled {
  color: var(--light-gray);
  background: var(--gray);
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

@media (min-width: 850px) {
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
</style>
