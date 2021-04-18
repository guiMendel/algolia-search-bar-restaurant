<template>
  <!-- hides all elemets but the highlighted one -->
  <div class="shadow"></div>

  <!-- stays on top of all elements, even the highlighted one -->
  <div class="tutorial-container">
    <!-- only display the box whose phase is active -->
    <tutorial-dialogue-box
      v-for="(phase, index) in tutorialPhases"
      :key="index"
      @advance="currentTutorialPhase++"
      :active="currentTutorialPhase == index"
      :vertical="phase.position ? phase.position[0] : 'center'"
      :horizontal="phase.position ? phase.position[1] : 'center'"
      :show="phase.show"
      :highlight="phase.highlight"
      :content="phase.content"
      :advanceOn="phase.advanceOn"
      :action="phase.action"
    />
  </div>
</template>

<script>
import TutorialDialogueBox from "../components/TutorialDialogueBox.vue"
import { mapState, mapMutations } from "vuex"

export default {
  name: "Tutorial",
  components: {
    TutorialDialogueBox,
  },
  data() {
    return {
      currentTutorialPhase: 0,
      // Indicates whether a restaurant has been selected in the current tutorial phase
      restaurantSelectedDuringPhase: false,
    }
  },
  computed: {
    ...mapState(["usingNYcoords", "coords", "mapOpen"]),
    tutorialPhases() {
      return [
        {
          content: `Welcome to our <b>Restaurant Locator Demo</b>! This quick guide will walk you through it's main features`,
        },
        {
          highlight: ["search-bar"],
          content: `The search bar offers a <b>search-as-you-type</b> experience, and provides a wide variety of filters to <b>further refine</b> your search`,
        },
        {
          show: ["results"],
          action: () => this.toggleMap(false),
          content: `Here you can find all the <b>resulting pages</b> of your search, sorted by distance, star count and review count`,
          position: ["top", "left"],
        },
        {
          show: ["results"],
          highlight: ["top-page-control"],
          content: `You can <b>cycle through</b> the pages by clicking these arrows, or <b>select the page number</b> and input a specific one`,
          position: ["bottom", "left"],
        },
        {
          show: ["main-buttons", "location-message"],
          highlight: ["toggle-NY-coords"],
          advanceOn: this.usingNYcoords,
          position: [, "right"],
          content: `Our service uses data location. In case it's not possible to share your location, you can always <b>simulate the location from New York</b> by clicking this button. Try it now!`,
        },
        {
          show: ["main-buttons", "location-message"],
          highlight: ["toggle-map"],
          advanceOn: this.mapOpen,
          content: `By clicking this button, you can expand a <b>map of the local area</b>, if some type of location is provided`,
          position: [, "right"],
        },
        {
          show: ["location-message", "map", "results"],
          action: this.openMap,
          content: `On the map, <b>the flag indicates your position</b>, and the pins indicate <b>the location of the restaurants</b> in the current page`,
          position: ["top", "left"],
        },
        {
          show: ["location-message", "map", "results"],
          highlight: ["refocus-button"],
          action: this.openMap,
          content: `Whenever necessary, use this button to <b>recenter the map</b> on you`,
          position: ["top", "left"],
        },
        {
          show: ["location-message", "map", "main-buttons", "results"],
          action: this.openMap,
          advanceOn: this.restaurantSelectedDuringPhase,
          content: `By selecting one of the pins, you will be scrolled to the <b>corresponding restaurant</b>. Give it a try!<br>Tip: if you don't see any pins, try turning on the NY location simulator`,
          position: ["top", "left"],
        },
        {
          show: ["location-message", "map", "results"],
          action: () => this.toggleMap(false),
          advanceOn: this.restaurantSelectedDuringPhase,
          content: `You can also select a restaurant on the list to be scrolled to it's <b>position on the map</b>! Try it out!`,
          position: ["top", "left"],
        },
      ]
    },
  },
  methods: {
    ...mapMutations(["toggleTutorial", "toggleMap", "useNYcoords"]),
    openMap() {
      // Opens map. If no coords are available, toggles NY simulation
      if (!this.coords) this.useNYcoords()
      this.toggleMap(true)
    },
  },
  watch: {
    currentTutorialPhase(value) {
      // Reset indicator
      this.restaurantSelectedDuringPhase = false

      // Close tutorial when there are no more phases to display
      if (value >= this.tutorialPhases.length) this.toggleTutorial(false)
    },
  },
  mounted() {
    // Watch for restaurant selection to update indicator
    this.$store.commit("subscribeToRestaurantSelection", {
      observer: "tutorial",
      onSelect: () => (this.restaurantSelectedDuringPhase = true),
    })
  },
  beforeUnmount() {
    // Unsubscribe
    this.$store.commit("unsubscribeToRestaurantSelection", "tutorial")
  },
}
</script>

<style scoped>
.shadow {
  position: fixed;
  z-index: 200;

  width: 100vw;
  height: 100vh;

  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  animation: fade-in 500ms;
}

.tutorial-container {
  z-index: 220;
  position: fixed;

  top: 0;
  left: 0;

  width: 100vw;
  height: 100vh;

  /* background-color: white; */

  padding: 2rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;

  pointer-events: none;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
