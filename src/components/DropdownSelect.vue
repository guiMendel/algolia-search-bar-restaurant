<template>
  <div class="container">
    <!-- If something is selected, we want special colors -->
    <div
      class="dropdown-button"
      :class="{ active: selectedOption }"
      @click="active = !active"
    >
      <p>{{ format(selectedOption || placeholder) }}</p>
      <span class="material-icons-round"> expand_more </span>
    </div>
    <list-select
      v-show="active"
      :name="format(placeholder)"
      :options="options"
      :searchable="true"
      @close="closeDropdown"
      @toggle-select="(option) => $emit('toggle-select', option)"
    />
    <!-- <select :value="selectedOption" @input="select">
    <option disabled value="">{{ format(placeholder) }}</option>
    <option v-for="(count, option) in options" :key="option" :value="option">
      {{ option }} ({{ count }})
    </option>
  </select> -->
  </div>
</template>

<script>
// Uses this selection list when dropdown is active
import ListSelect from "./ListSelect.vue";

export default {
  name: "DropdownSelect",
  emits: ["toggle-select"],
  props: {
    placeholder: String,
    options: Object,
  },
  components: {
    ListSelect,
  },
  data: () => ({
    selectedOption: "",
    active: false,
  }),
  methods: {
    // Turns from snake case to capitalized case
    format(title) {
      return title
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    },
    closeDropdown() {
      this.active = false;
      console.log(this.options);
    },
    // select({ target: { value } }) {
    //   this.selectedOption = value;
    //   this.$emit("select", value);
    // },
  },
};
</script>

<style scoped>
.dropdown-button {
  --padv: 0.2rem;
  --padh: 0.7rem;
  --border: 1px;

  display: flex;
  align-items: center;

  padding: var(--padv) var(--padh);
  border: var(--border) solid var(--light-gray);
  border-radius: 30px;

  color: var(--text-light);
  background-color: white;

  box-sizing: border-box;

  cursor: pointer;
}

.dropdown-button:active,
.dropdown-button:hover {
  --increase: 1px;

  filter: brightness(0.95);
  border: calc(var(--border) + var(--increase)) solid var(--light-gray);

  /* discounts the padding so as to not increase elements size */
  padding: calc(var(--padv) - var(--increase))
    calc(var(--padh) - var(--increase));
}

.dropdown-button.active {
  background-color: var(--blue);
  color: white;
}

p {
  flex: 1;
  width: max-content;
}
</style>