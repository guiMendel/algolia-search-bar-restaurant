<template>
  <main>
    <div class="searchbar">
      <span class="material-icons-round">search</span>
      <input
        type="text"
        autocomplete="off"
        v-model="input"
        :placeholder="placeholder"
      />
    </div>
    <div class="facets">
      <p v-if="Object.keys(facets).length == 0" class="no-facets">
        No filters available for this search
      </p>
      <dropdown-select
        v-for="(options, facet) of facets"
        :key="facet"
        :placeholder="facet"
        :options="options"
        @toggle-select="(option) => toggleFacet(facet, option)"
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
      // console.log(event.results);
      // Will transmit results to parent
      this.$emit("result", event.results);

      // Update facet lists
      this.updateFacets(event.results.disjunctiveFacets);
      // For each facet that is available, update data facets to hold its possible values
      // Update the ui to show fact selection
    },
    updateFacets(facets) {
      this.facets = {};
      for (const facet of facets) {
        this.facets[facet.name] = facet.data;
      }
    },
    // Redoes the search with new facet value
    toggleFacet(facet, value) {
      this.helper.toggleFacetRefinement(facet, value).search();
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
  top: 0;
  position: sticky;

  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 0.7rem 0 0.5rem;

  gap: 0.5rem;

  background-color: white;

  box-shadow: 0 1px 200px 20px rgba(24, 24, 26, 0.2);
}

.searchbar {
  width: 100%;

  padding: 0 1rem;

  display: flex;
  align-items: center;
  /* border-bottom: 1px solid var(--light-gray); */
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
  color: var(--gray);
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

  overflow-x: auto;
  overflow-y: visible;
  /* 
  padding-bottom: 250px;
  margin-bottom: -250px; */
}

.no-facets {
  font-style: italic;
  color: var(--text-light);
}
</style>