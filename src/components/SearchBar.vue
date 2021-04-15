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
      <!-- when no facets and no user input, its loading 99% of the times -->
      <p
        v-if="Object.keys(facets).length == 0 && input.length > 0"
        class="no-facets"
      >
        No filters available for this search
      </p>
      <dropdown-select
        v-for="({ data, searchable }, facet) of refinedFacetsFirst(facets)"
        :key="facet"
        :placeholder="facet"
        :search="
          searchable ? async (query) => searchFacetValues(facet, query) : null
        "
        :options="data"
        :is-open="currentlyOpenFacetMenu === facet"
        :set-open="(state) => setOpen(facet, state)"
        @toggle-select="(name) => toggleFacet(facet, name)"
      />
    </div>
  </main>
</template>

<script>
import { helper, searchable } from "../helpers/algolia"
import DropdownSelect from "./DropdownSelect.vue"

export default {
  name: "SearchBar",
  emits: ["result"],
  props: {
    placeholder: String,
  },
  data: () => ({
    helper,
    // Indicates which facets are searchable
    searchable,
    // Syntax: { searchable, data: { name, count, isRefined } }
    facets: {},
    input: "",
    // Indicates which facet menu is currently open (as this is a prototype, it's not worth using routes)
    currentlyOpenFacetMenu: null,
    // Info on all refined facets
    refinedFacets: [],
  }),
  components: {
    DropdownSelect,
  },
  created() {
    // this.helper.on("result", console.log);
    this.helper.on("result", this.onResult)

    // Initial results
    this.helper.search()
  },
  methods: {
    // Orders refined facets first
    refinedFacetsFirst(facets) {
      const refined = {}
      const unrefined = {}
      for (const facet in facets) {
        if (facets[facet].data.find((value) => value.isRefined)) {
          refined[facet] = facets[facet]
        } else {
          unrefined[facet] = facets[facet]
        }
      }
      return Object.assign(refined, unrefined)
    },
    // The function we wrap and give to the dropdowns so they can control their "openness"
    setOpen(facet, state) {
      this.currentlyOpenFacetMenu = state ? facet : null
    },
    onResult(event) {
      // console.log(event.results);
      // Will transmit results to parent
      this.$emit("result", event.results)

      // Update facet lists
      this.updateFacets(event.results)
      // this.helper.searchForFacetValues("food_type", "").then(console.log)
      // console.log(this.helper.getRefinements("food_type"))
    },
    // Wrapper for searchForFacetValues that already includes any missing refined values
    // Third parameter is optional, if missing we make another call to api
    async searchFacetValues(facet, query) {
      const { facetHits } = await this.helper.searchForFacetValues(facet, query)

      // Return it in the facet syntax adopted
      const result = facetHits.map(({ value: name, count, isRefined }) => ({
        name,
        count,
        isRefined,
      }))

      // searchForFacetValues may omit refined facets if they're not included in the search results.
      // Therefore, we need to manually add any missing refined facets, so the user can see they're refined!
      const refined = this.refinedFacets
        .filter(
          // From all already refined facets
          ({ attributeName, name: refinedValue }) =>
            // Only those that match this facet
            attributeName === facet &&
            // And that are not already present in the search results
            !facetHits.find(({ value }) => value === refinedValue),
        )
        // Reformat them to our syntax
        .map(({ name, count }) => ({ name, count, isRefined: true }))

      // Add them to the results
      result.push(...refined)

      return result
    },
    async updateFacets(results) {
      const facets = results.disjunctiveFacets
      this.facets = {}

      this.refinedFacets = results.getRefinements()

      // For each facet
      for (const { name: facet } of facets) {
        // If this facet is searchable
        if (this.searchable.includes(facet)) {
          this.facets[facet] = {
            // This method already adopts the same syntax as non-searchable facets
            data: await this.searchFacetValues(facet, ""),
            searchable: true,
          }
        }
        // If not searchable, we get all facets
        else {
          this.facets[facet] = {
            data: results.getFacetValues(facet, {
              sortBy: ["count:desc"],
            }),
            searchable: false,
          }
        }
      }
    },
    // Redoes the search with new facet value
    toggleFacet(facet, value) {
      this.helper.toggleFacetRefinement(facet, value).search()
    },
  },
  watch: {
    input(value) {
      this.helper.setQuery(value).search()
    },
  },
}
</script>

<style scoped>
main {
  top: 0;
  position: sticky;

  z-index: 100;

  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 0.7rem 0 0.5rem;

  gap: 0.5rem;

  background-color: white;

  box-shadow: 0 1px 200px 20px rgba(24, 24, 26, 0.2);

  animation: slide-down 500ms cubic-bezier(0.165, 0.84, 0.44, 1) backwards;
  animation-delay: 200ms;
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
  height: 3rem;

  padding: 0 1rem;

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

@keyframes slide-down {
  from {
    transform: translate(0, -100%);
  }

  to {
    transform: none;
  }
}
</style>
