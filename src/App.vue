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
        :class="{
          active: showMap && !splitScreen,
          disabled: !showMap && !coords,
        }"
        @click="toggleMap(!showMap)"
        :icon="mapIcon"
        :hoverMessage="mapHoverMessage"
      />
    </div>

    <!-- search bar -->
    <search-bar placeholder="search by name, cuisine or location" />

    <div class="results" :class="{ hide: splitScreen && showMap }">
      <!-- results -->
      <restaurant-index />
    </div>

    <!-- map -->
    <transition name="slide">
      <Map
        v-show="showMap || splitScreen"
        class="map"
        @open="!splitScreen && toggleMap(true)"
      />
    </transition>

    <!-- footer with additional messages -->
    <p v-if="locationMessage" class="location-message">
      {{ locationMessage }}
    </p>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex"
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
    useNYcoords: false,
    showMap: false,
    // Determines if screen is split between map and results
    splitScreen: window.innerWidth >= 1024,
  }),
  computed: {
    ...mapState(["coords"]),
    locationIcon() {
      if (this.useNYcoords) return "location_off"
      else if (this.coords) return "location_on"
      else return "fmd_bad"
    },
    mapIcon() {
      if (this.splitScreen) {
        if (this.showMap) return "close_fullscreen"
        else return "open_in_full"
      } else return "map"
    },
    mapHoverMessage() {
      if (this.splitScreen) {
        if (this.showMap) return "Condense map"
        else return "Expand map"
      } else return "Show map"
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
    ...mapMutations(["setCoords"]),
    ...mapActions(["updateCoords"]),
    setSplitScreen() {
      this.splitScreen = window.innerWidth >= 1024
    },
    toggleMap(open) {
      // Only open if there are coords, but can always close
      this.showMap = this.coords && open
    },
  },
  created() {
    // Get user location
    this.updateCoords()

    // Initialize split screen indicator
    this.setSplitScreen()

    // Listen to changes in screen width
    window.addEventListener("resize", () => this.setSplitScreen())

    // Close map when a restaurant is selected from the map
    this.$store.commit(
      "subscribeToRestaurantSelection",
      (_, selector) => selector === "marker" && (this.showMap = false),
    )
  },
  watch: {
    useNYcoords(use) {
      if (use) {
        // Use NY coords!
        this.setCoords({
          lat: 40.71,
          lng: -74.012,
        })
      } else {
        this.updateCoords()
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

  width: 100%;
  height: 100%;
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
  /* 
  display: flex;
  flex-direction: column;
  align-items: center; */

  padding-top: 8rem;
  padding-bottom: 8rem;
}

.results.hide {
  display: none;
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
