<template>
  <div class="container">
    <div class="stars">
      <span class="material-icons-round" v-for="star in stars" :key="star">
        {{ getIconFor(star) }}
      </span>
    </div>
    <small>{{ reviews }} reviews</small>
  </div>
</template>

<script>
// A component that translates a rating into a 5 star rating component
export default {
  name: "StarRating",
  props: {
    rating: Number,
    reviews: Number,
  },
  computed: {
    stars() {
      // Range 0...4
      return [...Array(5).keys()].map((index) => this.rating - index);
    },
  },
  methods: {
    getIconFor(star) {
      if (star <= 0) return "star_border";
      else if (star >= 1) return "star";
      else return "star_half";
    },
  },
};
</script>

<style scoped>
.stars {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  color: var(--gold);
}

.container {
  display: flex;
  flex-direction: column;

  align-items: center;
}

.container > small {
  font-style: italic;
  color: var(--text-light);
  font-weight: 300;
}
</style>