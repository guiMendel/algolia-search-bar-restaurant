<template>
  <input type="text" autocomplete="off" v-model="input" />
</template>

<script>
import helper from "../helpers/algolia";

export default {
  name: "SearchBar",
  emits: ["result"],
  data: () => ({
    helper,
    input: "",
    facets: {},
  }),
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
      // console.log(event.results.getFacetValues("payment_options"));
      // For each facet that is available, update data facets to hold its possible values
      // If not available, have it deleted from data facets
      // Update the ui to show fact selection
    },
  },
  watch: {
    input(value) {
      this.helper.setQuery(value).search();
    },
  },
};
</script>