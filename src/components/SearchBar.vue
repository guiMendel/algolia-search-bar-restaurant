<template>
  <input type="text" />
</template>

<script>
import algoliasearch from "algoliasearch";
import algoliasearchHelper from "algoliasearch-helper";

console.log(import.meta.env);
const client = algoliasearch(
  import.meta.env.VITE_APP_ID,
  import.meta.env.VITE_API_KEY
);
const helper = algoliasearchHelper(client, "restaurants");

export default {
  name: "SearchBar",
  data: () => ({
    helper,
  }),
  created() {
    // Will transmit results to parent
    // this.helper.on("result", console.log);
    this.helper.on("result", (event) => this.$emit("result", event.results));

    // Initial results
    this.helper.search();
  },
  emits: ["result"],
};
</script>