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

    <!-- not openable during the tutorial -->
    <list-select
      v-if="isOpen && !tutorialOpen"
      :name="adjustCase(placeholder)"
      :options="options"
      :search="search"
      @close="setOpen(false)"
      @toggle-select="toggleSelect"
    />
  </div>
</template>

<script>
import { mapState } from "vuex"
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
    ...mapState(["tutorialOpen"]),
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
  display: flex;
  align-items: center;

  padding: var(--dropdown-padv) var(--dropdown-padh);
  border: var(--dropdown-border) solid var(--light-gray);
  border-radius: 30px;

  color: var(--text-light);
  /* background-color: white; */
  background: var(--background);

  box-sizing: border-box;

  cursor: pointer;

  transition: all 100ms;
}

.dropdown-button:active,
.dropdown-button:hover {
  filter: brightness(0.95);
  border: calc(var(--dropdown-border) + var(--dropdown-increase)) solid
    var(--light-gray);

  /* discounts the padding so as to not dropdown-increase elements size */
  padding: calc(var(--dropdown-padv) - var(--dropdown-increase))
    calc(var(--dropdown-padh) - var(--dropdown-increase));
}

.dropdown-button.active {
  /* background-color: var(--blue); */
  background: var(--background-blue);
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

<style>
:root {
  --dropdown-padv: 0.4rem;
  --dropdown-padh: 0.7rem;
  --dropdown-border: 1px;
  --dropdown-increase: 1px;
}
</style>
