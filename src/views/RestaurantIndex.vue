<template>
  <main>
    <!-- loading spin -->
    <loading v-if="!restaurants?.length" :active="loading" />

    <!-- number of results message -->
    <p class="number-of-results">
      {{ numberOfResults }}
    </p>

    <!-- "no matches" message -->
    <p v-if="!restaurants?.length && !loading" class="no-match">
      Sorry, no matches!
    </p>

    <pagination-control ref="top-page-control" id="top-page-control" />

    <!-- restaurants -->
    <div
      v-for="restaurant in restaurants"
      :key="restaurant.objectID"
      class="restaurant"
      :class="{ highlighted: highlightedRestaurant === restaurant.objectID }"
      :id="`restaurant-${restaurant.objectID}`"
      @mouseover="highlightRestaurant({ restaurantId: restaurant.objectID })"
      @click="
        selectRestaurant({
          restaurantId: restaurant.objectID,
          selector: 'index',
        })
      "
    >
      <!-- restaurant picture -->
      <img :src="restaurant.image_url" :alt="restaurant.name" />

      <!-- restaurant details -->
      <div class="details">
        <!-- restaurant name -->
        <h1 v-html="restaurant._highlightResult.name.value"></h1>

        <!-- restaurant rating -->
        <star-rating
          :rating="restaurant.stars_count"
          :reviews="restaurant.reviews_count"
        />

        <!-- restaurant additional info -->
        <div class="misc">
          <span>{{ restaurant.food_type }}</span>
          <span>{{ restaurant.area }}</span>
          <span>{{ restaurant.price_range }}</span>
        </div>

        <!-- restaurant distance -->
        <small
          v-if="coords"
          class="distance"
          :class="{
            close: restaurantDistance(restaurant) <= 1,
          }"
          >{{ formatDistance(restaurantDistance(restaurant)) }} from you</small
        >
      </div>
    </div>

    <pagination-control v-if="restaurants?.length" />
  </main>
</template>

<script>
import Loading from "vue3-loading-overlay"
import StarRating from "../components/StarRating.vue"
import PaginationControl from "../components/PaginationControl.vue"
import { computeDistanceBetween, convertLatLng } from "spherical-geometry-js"
import { mapState, mapGetters, mapActions, mapMutations } from "vuex"

export default {
  name: "RestaurantIndex",
  components: {
    StarRating,
    PaginationControl,
    Loading,
  },
  data: () => ({
    restaurantDistances: {},
    loading: true,
  }),
  computed: {
    ...mapState(["page", "results", "coords", "highlightedRestaurant"]),
    ...mapGetters(["restaurants"]),
    numberOfResults() {
      if (!this.results) return ""
      return `
          ${
            this.results.nbHits > 999
              ? Math.round(this.results.nbHits / 1000) + "k"
              : this.results.nbHits
          } ${this.results.nbHits > 1 ? "results" : "result"} found in ${
        this.results.processingTimeMS > 99
          ? this.results.processingTimeMS / 1000.0 + " s"
          : this.results.processingTimeMS + " ms"
      }`
    },
  },
  methods: {
    ...mapActions(["selectRestaurant"]),
    ...mapMutations(["highlightRestaurant"]),
    restaurantDistance({ _geoloc: geolocation, objectID }) {
      // Check cache
      if (!this.restaurantDistances[objectID]) {
        let meters = computeDistanceBetween(
          convertLatLng(this.coords),
          convertLatLng(geolocation),
        )

        this.restaurantDistances[objectID] = Math.round(meters / 100.0) / 10.0
      }
      return this.restaurantDistances[objectID]
    },
    formatDistance(distance) {
      if (distance > 1000) return "Over 1000 km"
      else if (distance < 0.1) return "Less than 0.1 km"
      else if (distance <= 1) return `Only ${distance} km`
      else return `${distance} km`
    },
    scrollTo(restaurantId) {
      // Get reference to dom element
      const restaurant = document.getElementById(`restaurant-${restaurantId}`)

      if (restaurant) {
        // Wait for map to close
        setTimeout(() => {
          restaurant.scrollIntoView({
            behavior: "smooth",
            block: "center",
          })
        }, 100)
      }
    },
  },
  mounted() {
    // console.log(this.restaurants[0]);
    setTimeout(() => (this.loading = false), 2000)

    // Scroll to any selected restaurants
    this.$store.commit("subscribeToRestaurantSelection", {
      onSelect: this.scrollTo,
      observer: "index",
    })
  },
  watch: {
    coords() {
      // Clear cache
      this.restaurantDistances = {}
    },
    page() {
      this.$refs["top-page-control"].$el.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    },
  },
}
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

.number-of-results {
  margin-top: 0.5rem;
  color: var(--text-light);
  font-weight: 300;

  width: max-content;
}

.restaurant {
  display: grid;
  grid-template-columns: 0.7fr 1.3fr;

  place-items: center;
  justify-content: center;
  gap: 0.5rem;

  background-color: var(--color-2);

  width: 90%;
  max-width: 39rem;

  padding: 1rem;
  border-radius: 20px;

  text-align: flex;

  cursor: pointer;

  animation: fade-in 200ms backwards;
  transition: all 400ms;
}

.restaurant.highlighted {
  filter: sepia(0.05);
  box-shadow: 0 5px 30px 2px rgba(24, 24, 26, 0.2);
  transform: translate(0, -5px);
}

.restaurant > .details {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 0.3rem;
}

h1 {
  font-size: 1.2em;
  font-weight: 400;
}

img {
  width: 30vw;
  max-width: 207px;

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
  font-size: 0.8em;
}

.misc > span {
  background-color: var(--washed-gray);
  padding: 0.2rem 0.5rem;
  border-radius: 30px;
}

.distance {
  padding: 0.2rem 0.5rem;
  border-radius: 30px;

  margin-top: 0.5rem;

  font-size: 0.8em;
  color: var(--text-light);
}

.distance.close {
  color: white;
  background: var(--background-blue);
  /* background-color: var(--blue); */
  font-weight: 600;
}

.no-match {
  font-size: 1.6rem;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@media (min-width: 850px) {
  .number-of-results {
    font-size: 1.3rem;
    margin: 1.3rem 0;
  }

  .restaurant > .details {
    font-size: 1.2rem;
  }

  /* main {
    align-self: flex-start;
    align-items: flex-start;
    padding-left: 15vw;
  } */
}
</style>

<style>
/* Result highlighting */
.restaurant em {
  font-weight: 800;
  font-style: initial;
}
</style>
