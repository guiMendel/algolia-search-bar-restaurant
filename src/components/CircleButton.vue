<template>
  <div>
    <p class="hover-message">{{ hoverMessage }}</p>
    <span class="material-icons-round">{{ icon }} </span>
  </div>
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
div {
  position: relative;
  z-index: 50;

  font-size: 2em;

  width: 2em;
  height: 2em;

  cursor: pointer;

  background: var(--button-back);
  border-radius: 50%;
  /* color: var(--text); */

  box-shadow: 0 5px 10px 1px rgba(24, 24, 26, 0.2);
}

div > span {
  font-size: 1em;

  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;

  transition: filter 200ms;
}

div:active > span {
  filter: brightness(0.8);
  backdrop-filter: brightness(0.8);
}

.hover-message {
  display: none;

  position: absolute;
  top: 0.25em;
  right: 100%;

  width: max-content;

  margin-right: 0.5rem;

  padding: 0.7rem 1rem;
  border-radius: 10px;

  background: var(--overlay-message);
  backdrop-filter: blur(2px);
  color: white;

  font-family: "Source Sans Pro", Helvetica, Arial, sans-serif;
  font-size: 1.5rem;

  animation: fade-in 150ms backwards;
  animation-delay: 200ms;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (min-width: 850px) {
  div {
    font-size: 2.2em;
  }

  /* only display hover effects in desktops */
  div:hover > span {
    filter: brightness(1.3);
    backdrop-filter: brightness(1.3);
  }

  div:hover > .hover-message {
    display: initial;
  }
}
</style>
