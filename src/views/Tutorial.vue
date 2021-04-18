<template>
  <!-- hides all elemets but the highlighted one -->
  <div class="shadow"></div>

  <!-- stays on top of all elements, even the highlighted one -->
  <div class="tutorial-container">
    <tutorial-dialogue-box
      @close="$emit('close')"
      vertical="center"
      horizontal="center"
      :highlight="['search-bar']"
    >
      <p>
        The search bar offers a <b>search-as-you-type</b> experience, and provides a
        wide variety of filters to <b>further refine</b> your search
      </p></tutorial-dialogue-box
    >
  </div>
</template>

<script>
import TutorialDialogueBox from "../components/TutorialDialogueBox.vue"

export default {
  name: "Tutorial",
  emits: ["close"],
  components: {
    TutorialDialogueBox,
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
}

b {
  font-weight: 800;
  color: var(--blue);
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
