<template>
  <div class="container">
    <circle-button
      class="toggle-NY-coords"
      @click="useNYcoords = !useNYcoords"
      :icon="useNYcoords ? 'gps_off' : 'gps_fixed'"
    />
    <search-bar
      @result="handleResults"
      :coords="coords"
      placeholder="search by name, cuisine or location"
    />
    <template v-if="results.hits">
      <p class="number-of-results">
        {{ numberOfResults }}
      </p>
      <restaurant-index :coords="coords" :restaurants="results.hits" />
    </template>
  </div>
</template>

<script>
import CircleButton from "./components/CircleButton.vue"
import SearchBar from "./components/SearchBar.vue"
import RestaurantIndex from "./views/RestaurantIndex.vue"

export default {
  name: "App",
  components: {
    RestaurantIndex,
    SearchBar,
    CircleButton,
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
        // On error, just log
        console.error,
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

.number-of-results {
  margin-top: 0.5rem;
  color: var(--text-light);
  font-weight: 300;
}

.toggle-NY-coords {
  position: fixed;
  bottom: 3rem;
  right: 2rem;
}

@media (min-width: 850px) {
  .number-of-results {
    font-size: 1.3rem;
    margin: 1.3rem 0;
  }
}
</style>
