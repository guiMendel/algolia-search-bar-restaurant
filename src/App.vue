<template>
  <search-bar @result="handleResult" />
  <restaurant-index :restaurants="restaurants" />
</template>

<script>
import SearchBar from "./components/SearchBar.vue";
import RestaurantIndex from "./views/RestaurantIndex.vue";

export default {
  name: "App",
  components: {
    RestaurantIndex,
    SearchBar,
  },
  data: () => ({
    restaurants: [],
  }),
  methods: {
    handleResult(result) {
      this.restaurants = result.hits;
    },
  },
};
</script>
