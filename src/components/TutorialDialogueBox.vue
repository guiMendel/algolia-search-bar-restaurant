<template>
  <main>
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
  components: {
    CircleButton,
  },
}
</script>

<style scoped>
main {
  position: relative;

  padding: 2rem 2.5rem 1.5rem;
  width: max-content;

  background: var(--background);
  border-radius: 20px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
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
  padding: 0.5rem;
  /* background-color: var(--blue); */
  background: var(--background-blue);
  color: white;
  border-radius: 50%;

  font-size: 2rem;

  cursor: pointer;

  transition: filter 170ms;
}

.next:hover {
  /* background-color: var(--vibrant-blue); */
  filter: brightness(1.3);
}

</style>
