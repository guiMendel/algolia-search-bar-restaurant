<template>
  <div class="shadow" @click.self="$emit('close')">
    <div class="list">
      <span @click.self="$emit('close')" class="material-icons-round close"
        >close</span
      >
      <h1>{{ name }}</h1>
      <input
        v-if="search"
        type="text"
        placeholder="filter"
        @input="searchFor"
        ref="filter"
      />
      <ul>
        <!-- if no results -->
        <p v-show="processedOptions.length == 0" class="no-results">
          No results for the current filter combination
        </p>
        <!-- result list -->
        <li
          v-for="{ name, count, isRefined } in processedOptions"
          :key="name"
          :class="{ selected: isRefined }"
          @click="toggleSelected(name)"
        >
          <span class="material-icons-round">{{
            isRefined ? "check_box" : "check_box_outline_blank"
          }}</span>
          {{ name }} <em>({{ count }})</em>
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
    search: Function,
  },
  data() {
    return {
      processedOptions: this.options,
    }
  },
  methods: {
    toggleSelected(option) {
      this.$emit("toggle-select", option)
    },
    async searchFor(event) {
      this.processedOptions = await this.search(event.target.value)
    },
    // Closes popup. If used by an event listener, checks if it a keydown 'esc' event
    close(event) {
      if (!event || event.key == "Escape") {
        window.removeEventListener("keydown", this.close)
        this.$emit("close")
      }
    },
  },
  mounted() {
    // console.log(this.$refs)
    this.$refs?.filter?.focus()

    // Close on esc
    window.addEventListener("keydown", this.close)
  },
}
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
  min-width: 15rem;
  position: relative;

  max-height: 100%;

  padding: 1rem;
  border-radius: 10px;

  background: var(--background);

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

  cursor: pointer;

  transition: background 70ms;
}

.close:hover {
  background-color: var(--vibrant-blue);
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

  margin: 0 2rem;

  /* margin-bottom: 1rem; */
}

input {
  min-width: 100%;
  padding: 0.5rem;

  font-size: 1.2rem;

  border-radius: 10px;
  border: 2px solid var(--text-light);

  color: var(--text-light);

  background: none;
  outline: none;
}

li {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  cursor: pointer;
}

li:hover {
  /* color: var(--text-light); */
  filter: brightness(0.6);
}

li.selected,
li.selected span {
  color: var(--blue);
  animation: colorize 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) backwards;
}

span {
  color: var(--text-light);
}

em {
  color: var(--text-light);
  font-weight: 300;
}

.no-results {
  text-align: center;
  margin: 1rem 0;
}

@keyframes colorize {
  from {
    color: var(--vibrant-blue);
  }

  to {
    color: default;
  }
}
</style>
