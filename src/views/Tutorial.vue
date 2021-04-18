<template>
  <div class="tutorial-container">
    <tutorial-dialogue-box @close="$emit('close')"
      >I'm a box</tutorial-dialogue-box
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
.tutorial-container {
  z-index: 200;

  position: fixed;
  top: 0;
  left: 0;

  width: 100vw;
  height: 100vh;

  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);

  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 1.3rem;

  animation: fade-in 500ms;
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
