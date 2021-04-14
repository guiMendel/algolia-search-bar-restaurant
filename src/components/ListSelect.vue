<template>
  <div class="shadow" @click.self="$emit('close')">
    <div class="list">
      <span @click.self="$emit('close')" class="material-icons-round close"
        >close</span
      >
      <h1>{{ name }}</h1>
      <input v-if="searchable" type="text" placeholder="filter" />
      <ul>
        <li
          v-for="({ selected, value }, option) in processedOptions"
          :key="option"
          :class="{ selected }"
          @click="toggleSelected(option)"
        >
          <span class="material-icons-round">{{
            selected ? "check_box" : "check_box_outline_blank"
          }}</span>
          {{ option }} <em>({{ value }})</em>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "ListSelect",
  emits: ["toggle-select", "search", "close"],
  props: {
    name: String,
    options: Object,
    searchable: Boolean,
  },
  data: () => ({
    processedOptions: {},
  }),
  methods: {
    toggleSelected(option) {
      const wasSelected = this.processedOptions[option].selected;
      this.processedOptions[option].selected = !wasSelected;

      this.$emit("toggle-select", option);
    },
    processOptions() {
      const newOptions = {};

      // We add a 'selected' field to the options
      for (const option in this.options) {
        let selected = false;
        // If already present, keep selected status
        if (this.processedOptions[option]) {
          selected = this.processedOptions[option].selected;
        }
        newOptions[option] = {
          value: this.options[option],
          selected,
        };
      }

      this.processedOptions = newOptions;
    },
    // selectedOptions() {
    //   const it = Object.entries(this.options)
    //     // Filter to only selected options
    //     .filter(([, { selected }]) => selected)
    //     // Return only option names
    //     .map(([option]) => option);
    //   console.log(it);
    //   return it;
    // },
  },
  watch: {
    options() {
      this.processOptions();
    },
  },
  created() {
    this.processOptions();
  },
};
</script>

<style scoped>
.shadow {
  z-index: 100;

  width: 100vw;
  height: 100vh;

  left: 0;
  top: 0;
  position: fixed;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 2rem;

  background-color: rgb(0, 0, 0, 0.3);
}

.list {
  width: max-content;
  position: relative;

  max-height: 100%;

  padding: 1rem;
  border-radius: 10px;
  background-color: var(--color-1);

  align-items: center;

  font-size: 1.3rem;

  box-shadow: 0 1px 100px 1px rgba(24, 24, 26, 0.4);
}

.close {
  position: absolute;

  top: -1rem;
  right: -1rem;

  padding: 0.5rem;
  background-color: var(--blue);
  color: white;
  border-radius: 50%;

  font-size: 2rem;
}

.list,
ul {
  display: flex;
  flex-direction: column;

  gap: 1rem;

  list-style-type: none;
}

ul {
  align-items: flex-start;
  text-align: start;

  width: 100%;
  overflow: auto;
}

h1 {
  font-size: 1.7rem;
  font-weight: 400;

  /* margin-bottom: 1rem; */
}

input {
  min-width: 100%;
  padding: 0.5rem;

  font-size: 1.2rem;

  border-radius: 10px;
  border: 2px solid var(--text-light);

  color: var(--text-light);
}

li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

li.selected,
li.selected span {
  color: var(--blue);
}

span {
  color: var(--text-light);
}

em {
  color: var(--text-light);
  font-weight: 300;
}
</style>