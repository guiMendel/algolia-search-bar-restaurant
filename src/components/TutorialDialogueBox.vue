<template>
  <main :class="[`vertical-${vertical}`, `horizontal-${horizontal}`]">
    <span @click.self="$emit('close')" class="material-icons-round close"
      >close</span
    >
    <slot></slot>
    <span @click.self="$emit('close')" class="material-icons-round next"
      >navigate_next</span
    >
  </main>
</template>

<script>
import CircleButton from "./CircleButton.vue"

export default {
  name: "TutorialDialogueBox",
  emits: ["close"],
  props: {
    vertical: String,
    horizontal: String,
    highlight: Array,
  },
  components: {
    CircleButton,
  },
  mounted() {
    // Highlight all requested elements
    for (const id of this.highlight) {
      // document.getElementById(id).style.zIndex = 225
      document.getElementById(id).classList.add("tutorial-highlight")
    }
  },
  beforeUnmount() {
    // Undo element highlighting
    for (const id of this.highlight) {
      document.getElementById(id).classList.remove("tutorial-highlight")
    }
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

  transition: filter 170ms;
}

.next:hover {
  /* background-color: var(--vibrant-blue); */
  filter: brightness(1.3);
}

.vertical-top {
  top: 2rem;
}

.vertical-bottom {
  bottom: 2rem;
}

.horizontal-left {
  left: 2rem;
}

.horizontal-right {
  right: 2rem;
}
</style>

<style>
.tutorial-highlight {
  z-index: 200 !important;
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
