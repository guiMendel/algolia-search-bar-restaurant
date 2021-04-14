<template>
  <main>
    <div class="searchbar">
      <span class="material-icons-round">search</span>
      <input type="text" autocomplete="off" v-model="input" :placeholder="placeholder" />
    </div>
    <div class="facets">
      <dropdown-select
        v-for="(options, facet) of facets"
        :key="facet"
        :placeholder="facet"
        :options="options"
      />
    </div>
  </main>
</template>

<script>
import helper from "../helpers/algolia";
import DropdownSelect from "./DropdownSelect.vue";

export default {
  name: "SearchBar",
  emits: ["result"],
  props: {
    placeholder: String,
  },
  data: () => ({
    helper,
    facets: {},
    input: "",
  }),
  components: {
    DropdownSelect,
  },
  created() {
    // this.helper.on("result", console.log);
    this.helper.on("result", this.onResult);

    // Initial results
    this.helper.search();
  },
  methods: {
    onResult(event) {
      // Will transmit results to parent
      this.$emit("result", event.results);

      // Update facet lists
      this.updateFacets(event.results.facets);
      // For each facet that is available, update data facets to hold its possible values
      // Update the ui to show fact selection
    },
    updateFacets(facets) {
      for (const facet of facets) {
        this.facets[facet.name] = facet.data;
      }
    },
  },
  watch: {
    input(value) {
      this.helper.setQuery(value).search();
    },
  },
};
</script>

<style scoped>
main {
  top: 0.5rem;
  position: sticky;

  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 0.5rem 0;

  gap: 0.5rem;

  background-color: white;
  border-radius: 10px;

  box-shadow: 0 1px 2px 0.5px var(--washed-gray);
}

.searchbar {
  width: 100%;

  padding: 0 1rem;

  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--light-gray);
}

.searchbar input {
  flex: 1;
  padding: 0.5rem;

  background: none;
  border: none;
  outline: none;

  font-size: 1.1rem;
}

.searchbar input::placeholder {
  color: var(--light-gray);
}

.searchbar span {
  color: var(--gray);
}

.facets {
  width: 100%;

  padding: 0.3rem 1rem;

  display: flex;
  align-items: center;
  justify-content: flex-start;

  gap: 0.5rem;

  overflow: auto;
}
</style>