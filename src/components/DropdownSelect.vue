<template>
  <div class="container">
    <div
      class="dropdown-button"
      :class="{ active: selectedOptions.length }"
      @click="setOpen(true)"
    >
      <div class="title">
        <span>
          {{ format(selectedOptions, placeholder) }}
        </span>
        <span v-show="selectedOptions.length > 1" class="number-of-facets">
          {{ selectedOptions.length }}
        </span>
      </div>
      <span class="material-icons-round"> expand_more </span>
    </div>

    <list-select
      v-if="isOpen"
      :name="adjustCase(placeholder)"
      :options="options"
      :search="search"
      @close="setOpen(false)"
      @toggle-select="toggleSelect"
    />
  </div>
</template>

<script>
// Uses this selection list when dropdown is active
import ListSelect from "./ListSelect.vue"

export default {
  name: "DropdownSelect",
  emits: ["toggle-select"],
  props: {
    placeholder: String,
    options: Object,
    search: Function,
    isOpen: Boolean,
    // Wrapper bestowed by parent to allow us to change isOpen state
    setOpen: Function,
  },
  components: {
    ListSelect,
  },
  computed: {
    selectedOptions() {
      return (
        this.options
          // Only refined options
          .filter(({ isRefined }) => isRefined)
          // Only their names
          .map(({ name }) => name)
      )
    },
  },
  methods: {
    // Turns from snake case to capitalized case
    format(selections, placeholder) {
      if (selections.length == 1) return this.adjustCase(selections[0])
      return this.adjustCase(placeholder)
    },
    adjustCase(title) {
      return title
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    },
    toggleSelect(option) {
      this.$emit("toggle-select", option)
    },
    // select({ target: { value } }) {
    //   this.selectedOption = value;
    //   this.$emit("select", value);
    // },
  },
}
</script>

<style scoped>
.dropdown-button {
  --padv: 0.4rem;
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

  transition: all 100ms;
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

.title {
  flex: 1;
  width: max-content;

  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.number-of-facets {
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: var(--color-1);
  color: var(--blue);
  border-radius: 50%;

  font-weight: 800;
}
</style>
