<template>
  <div class="container">
    <!-- tutorial -->
    <tutorial v-if="tutorialOpen" />

    <!-- search bar -->
    <search-bar
      id="search-bar"
      placeholder="search by name, cuisine or location"
    />

    <div id="results" :style="resultsStyle">
      <!-- results -->
      <restaurant-index />
    </div>

    <!-- map -->
    <transition name="slide">
      <Map id="map" v-show="mapOpen || splitScreen" />
    </transition>

    <!-- buttons -->
    <div id="main-buttons">
      <circle-button
        id="toggle-NY-coords"
        :class="{ active: !usingNYcoords && coords }"
        @click="toggleNYcoords"
        :icon="locationIcon"
        :hoverMessage="locationHoverMessage"
      />
      <circle-button
        id="toggle-map"
        :class="{
          active: mapOpen && !splitScreen,
          disabled: !mapOpen && !coords,
        }"
        @click="toggleMap(!mapOpen)"
        :icon="mapIcon"
        :hoverMessage="mapHoverMessage"
      />
      <circle-button
        v-show="!tutorialOpen"
        class="toggle-tutorial"
        @click="toggleTutorial(true)"
        icon="help_outline"
        hoverMessage="Quick demo tour"
      />
    </div>

    <!-- footer with additional messages -->
    <p v-show="locationMessage" id="location-message">
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
import Tutorial from "./views/Tutorial.vue"

export default {
  name: "App",
  components: {
    RestaurantIndex,
    Tutorial,
    SearchBar,
    CircleButton,
    Map,
  },
  computed: {
    ...mapState([
      "coords",
      "usingNYcoords",
      "mapOpen",
      "tutorialOpen",
      "splitScreen",
    ]),
    resultsStyle() {
      // When split screen & map is extended, hide
      return { display: this.splitScreen && this.mapOpen ? "none" : "initial" }
    },
    locationIcon() {
      if (this.usingNYcoords) return "location_off"
      else if (this.coords) return "location_on"
      else return "fmd_bad"
    },
    mapIcon() {
      if (this.splitScreen) {
        if (this.mapOpen) return "close_fullscreen"
        else return "open_in_full"
      } else return "map"
    },
    mapHoverMessage() {
      if (this.splitScreen) {
        if (this.mapOpen) return "Condense map"
        else return "Expand map"
      } else return "Show map"
    },
    locationHoverMessage() {
      if (this.usingNYcoords) return "Simulating location from New York"
      else if (this.coords) return "Using real geolocation"
      else return "No location access"
    },
    locationMessage() {
      if (this.usingNYcoords) return "Simulating location from New York"
      else if (!this.coords) return "Failed to retrieve current location"
      else return ""
    },
  },
  methods: {
    ...mapMutations([
      "setCoords",
      "toggleMap",
      "toggleTutorial",
      "setSplitScreen",
    ]),
    ...mapActions(["updateCoords", "toggleNYcoords"]),
  },
  created() {
    // Get user location
    this.updateCoords()

    // Initialize split screen indicator
    this.setSplitScreen()

    // Listen to changes in screen width
    window.addEventListener("resize", () => this.setSplitScreen())
  },
}
</script>

<style scoped>
.container {
  width: 100%;

  display: flex;
  justify-content: center;
}

.container.no-scroll {
  overflow: hidden;
}

#map {
  position: fixed;

  width: 100%;
  height: 100%;
}

#main-buttons {
  z-index: 100;

  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.5rem;

  position: fixed;
  bottom: 4rem;
  right: 2rem;
}

#main-buttons > *.active {
  color: var(--blue);
}

#main-buttons > *.disabled {
  color: var(--light-gray);
  background: var(--gray);
}

#results {
  width: 100%;

  background-color: var(--color-2);

  padding-top: 8rem;
  padding-bottom: 8rem;
}

#results.hide {
  display: none;
}

#location-message {
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
  #results {
    padding-top: 9rem;
  }
}
@media (min-width: 850px) {
  #main-buttons {
    flex-direction: column-reverse;
  }

  #location-message {
    right: 0;
    width: max-content;

    color: var(--text);

    padding: 0.5rem 1rem;
    border-radius: 20px 0 0 0;
  }

  #map {
    z-index: 5;
    position: sticky;
    top: 0;
    height: 100vh;

    width: 100%;
  }

  #results {
    z-index: 10;

    min-width: 38rem;
    box-shadow: 0 0 80px 50px rgba(24, 24, 26, 0.1);
  }
}
</style>
