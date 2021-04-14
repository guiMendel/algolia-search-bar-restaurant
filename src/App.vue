<template>
  <div class="container">
    <search-bar
      @result="handleResult"
      placeholder="search by name, cuisine or location"
    />
    <restaurant-index :restaurants="restaurants" />
  </div>
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

<style scoped>
.container {
  width: 100%;

  display: flex;
  flex-direction: column;

  padding: 0.5rem 1rem;
}
</style>