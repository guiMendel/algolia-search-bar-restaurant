<template>
  <transition name="fade">
    <main
      v-if="active"
      :class="[`vertical-${vertical}`, `horizontal-${horizontal}`]"
      :style="{ paddingBottom: advanceButtonAvailable ? '3rem' : '2rem' }"
    >
      <!-- close button -->
      <span
        @click.self="toggleTutorial(false)"
        class="material-icons-round close"
        >close</span
      >

      <!-- dialogue text -->
      <p v-html="content" class="tutorial-dialogue"></p>

      <!-- advance button -->
      <span
        v-if="advanceButtonAvailable"
        @click.self="advance"
        class="material-icons-round next"
        >navigate_next</span
      >
    </main>
  </transition>
</template>

<script>
import { mapMutations } from "vuex"
import CircleButton from "./CircleButton.vue"

export default {
  name: "TutorialDialogueBox",
  emits: ["advance"],
  props: {
    // If this dialogue is to be currently displayed
    active: Boolean,
    // Vertical position
    vertical: String,
    // Horizontal position
    horizontal: String,
    // The dialogue text
    content: String,
    // The DOM ids of elements to be displayed over the shadow
    show: Array,
    // The DOM ids of elements to be displayed over the shadow and hihlighted
    highlight: Array,
    // When this becomes true, automatically advances to next phase. Disables advance button (unless it's true from the very beginning)
    advanceOn: Boolean,
    // An action to be performed when this dialogue pops up
    action: Function,
  },
  data: () => ({
    // Indicates whether advance has been called
    advancing: false,
  }),
  components: {
    CircleButton,
  },
  computed: {
    advanceButtonAvailable() {
      // If no advanceOn is set, or if it is set but was already true from the very beginning
      console.log(this.advanceOn)
      return this.advanceOn == null || (this.advanceOn && !this.advancing)
    },
  },
  methods: {
    ...mapMutations(["toggleTutorial"]),
    advance() {
      this.advancing = true
      this.$emit("advance")
    },
    showElements() {
      // Show all requested elements
      if (this.show)
        for (const id of this.show) {
          // document.getElementById(id).style.zIndex = 225
          document.getElementById(id).classList.add("tutorial-show")
        }

      // Highlight all requested elements
      if (this.highlight)
        for (const id of this.highlight) {
          // document.getElementById(id).style.zIndex = 225
          const element = document.getElementById(id)
          if (element) {
            // Scroll to the last highlighted element
            element.scrollIntoView({ block: "center" })
            element.classList.add("tutorial-show")
            element.classList.add("tutorial-highlight")
          }
        }
    },
    hideElements() {
      // Undo element highlighting
      for (const id of [...(this.highlight ?? []), ...(this.show ?? [])]) {
        const element = document.getElementById(id)
        if (element) {
          element.classList.remove("tutorial-highlight")
          element.classList.remove("tutorial-show")
        }
      }
    },
  },
  watch: {
    active() {
      if (this.active) {
        // Perform it's action
        if (this.action) this.action()

        // Wait a bit before showing elements
        setTimeout(this.showElements, 100)
      } else {
        this.hideElements()
      }
    },
    advanceOn(passes) {
      if (passes && this.active) this.advance()
    },
  },
  beforeUnmount() {
    // Certifies to always clean up after itself
    this.hideElements()
  },
}
</script>

<style scoped>
main {
  position: fixed;

  padding: 2rem 2rem 3rem;
  width: max-content;
  max-width: min(40rem, 80vw);

  background: var(--background);
  border-radius: 20px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;

  font-size: 1.3rem;
  font-weight: 600;

  box-shadow: 0 1px 100px 40px rgba(24, 24, 26, 0.4);

  pointer-events: all;
}

.close {
  position: absolute;

  top: -1rem;
  right: -1rem;

  padding: 0.5rem;
  /* background-color: var(--blue); */
  background: var(--background-gray);
  color: white;
  border-radius: 50%;

  font-size: 2rem;

  cursor: pointer;

  transition: filter 170ms;
}

.close:hover {
  /* background-color: var(--vibrant-blue); */
  filter: brightness(1.3);
}

.next {
  position: absolute;
  bottom: -2rem;

  padding: 0.5rem;
  /* background-color: var(--blue); */
  background: var(--background-blue);
  color: white;
  border-radius: 50%;

  font-size: 3rem;

  cursor: pointer;

  transition: all 170ms;
}

.next:not(.disabled):hover {
  /* background-color: var(--vibrant-blue); */
  filter: brightness(1.3);
  transform: translateY(-2px);
}

.vertical-top {
  top: 2rem;
}

.vertical-bottom {
  bottom: 5rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 400ms ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (min-width: 850px) {
  .horizontal-left {
    left: 2rem;
  }

  .horizontal-right {
    right: 2rem;
  }
}
</style>

<style>
.tutorial-show {
  z-index: 200 !important;
}

.tutorial-highlight {
  outline: 5px solid var(--vibrant-blue);
  outline-offset: 5px;
}

@keyframes float {
  from {
    transform: none;
  }
  to {
    transform: translateY(-5px);
  }
}
</style>

<style>
.tutorial-dialogue b {
  font-weight: 800;
  color: var(--blue);
}
</style>
