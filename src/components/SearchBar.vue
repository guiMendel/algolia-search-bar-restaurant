<template>
  <input type="text" autocomplete="off" v-model="input" />
</template>

<script>
import algoliasearch from "algoliasearch";
import algoliasearchHelper from "algoliasearch-helper";

const client = algoliasearch(
  import.meta.env.VITE_APP_ID,
  import.meta.env.VITE_API_KEY
);
const helper = algoliasearchHelper(client, "restaurants");

export default {
  name: "SearchBar",
  emits: ["result"],
  data: () => ({
    helper,
    input: "",
  }),
  created() {
    // Will transmit results to parent
    // this.helper.on("result", console.log);
    this.helper.on("result", (event) => this.$emit("result", event.results));

    // Initial results
    this.helper.search();
  },
  watch: {
    input(value) {
      this.helper.setQuery(value).search();
    },
  },
};
</script>