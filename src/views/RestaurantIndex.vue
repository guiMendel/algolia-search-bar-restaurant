<template>
  <main>
    <p
      class="restaurant"
      v-for="restaurant in restaurants"
      :key="restaurant.objectID"
      v-html="restaurant._highlightResult.name.value"
    ></p>
  </main>
</template>

<script>
export default {
  name: "RestaurantIndex",
  props: {
    restaurants: Array,
  },
};
</script>

<style scoped>
main {
  font-size: 1.2rem;

  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>

<style>
/* Result highlighting */
.restaurant em {
  font-weight: 800;
  font-style: initial;
}
</style>