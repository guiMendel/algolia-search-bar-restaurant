<template>
  <span class="material-icons-round">{{ icon }}</span>
</template>

<script>
export default {
  name: "CircleButton",
  props: {
    icon: String,
    hoverMessage: String,
  },
}
</script>

<style scoped>
span {
  font-size: 2em;

  width: 2em;
  height: 2em;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  background: var(--background);
  border-radius: 50%;
  /* color: var(--text); */

  box-shadow: 0 5px 10px 1px rgba(24, 24, 26, 0.2);

  transition: filter 200ms;
}

span:hover {
  filter: brightness(1.3);
}

span:active {
  filter: brightness(0.95);
}
</style>
