<template>
  <div>
    <p>{{ format(placeholder) }}</p>
    <span class="material-icons-round"> expand_more </span>
  </div>
  <select :value="selected" @input="select">
    <option disabled value="">{{ format(placeholder) }}</option>
    <option v-for="(count, option) in options" :key="option" :value="option">
      {{ option }}
    </option>
  </select>
</template>

<script>
export default {
  name: "DropdownSelect",
  emits: ["select"],
  props: {
    placeholder: String,
    options: Object,
  },
  data: () => ({
    selected: "",
  }),
  methods: {
    // Turns from snake case to capitalized case
    format(title) {
      return title
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    },
    select({ target: { value } }) {
      this.selected = value;
      this.$emit("select", value);
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
  border-radius: 30px;

  color: var(--text-light);
}

p {
  flex: 1;
  width: max-content;
}
</style>