<template>
  <div>
    <p>{{ format(placeholder) }}</p>
    <span class="material-icons-round"> expand_more </span>
  </div>
</template>

<script>
export default {
  name: "DropdownSelect",
  props: {
    placeholder: String,
    options: Object,
  },
  methods: {
    // Turns from snake case to capitalized case
    format(title) {
      return title
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    },
  },
};
</script>

<style scoped>
div {
  display: flex;
  align-items: center;

  padding: 0.2rem 0.7rem;
  border: 1px solid var(--light-gray);
  border-radius: 20px;

  color: var(--text-light);
}

p {
  flex: 1;
  width: max-content;
}
</style>