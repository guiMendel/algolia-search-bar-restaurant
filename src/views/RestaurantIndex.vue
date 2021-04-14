<template>
  <main>
    <div
      v-for="restaurant in restaurants"
      :key="restaurant.objectID"
      class="restaurant"
    >
      <img :src="restaurant.image_url" :alt="restaurant.name" />
      <div class="details">
        <h1 v-html="restaurant._highlightResult.name.value"></h1>
        <star-rating
          :rating="restaurant.stars_count"
          :reviews="restaurant.reviews_count"
        />
        <div class="misc">
          <span>{{ restaurant.food_type }}</span>
          <span>{{ restaurant.area }}</span>
          <span>{{ restaurant.price_range }}</span>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import StarRating from "../components/StarRating.vue";

export default {
  name: "RestaurantIndex",
  props: {
    restaurants: Array,
  },
  components: {
    StarRating,
  },
  // created() {
  //   console.log(this.restaurants[0]);
  // },
};
</script>

<style scoped>
main {
  font-size: 1.2rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;

  padding: 2rem 1rem 1rem;
}

.restaurant {
  display: flex;
  align-items: center;

  background-color: var(--color-2);

  width: 80%;

  text-align: flex;
}

.restaurant > .details {
  flex: 1;

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 0.3rem;
}

h1 {
  font-size: 1.5rem;
  font-weight: 400;
}

img {
  width: 45%;
  border-radius: 10px;
  /* border: 1px solid gray; */
}

.misc {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.2rem;

  color: var(--text-light);
  font-size: 1rem;
}

.misc > span {
  background-color: var(--washed-gray);
  padding: 0.2rem 0.5rem;
  border-radius: 30px;
}
</style>

<style>
/* Result highlighting */
.restaurant em {
  font-weight: 800;
  font-style: initial;
}
</style>