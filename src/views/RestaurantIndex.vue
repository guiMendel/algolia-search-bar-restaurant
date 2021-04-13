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