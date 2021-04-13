<template>
  <main>
    <p v-for="restaurant in restaurants" :key="restaurant.objectID">
      {{ restaurant.name }}
    </p>
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