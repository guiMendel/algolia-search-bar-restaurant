<template>
  <main>
    <!-- <div v-if="coords" id="map" ref="map"></div> -->
    <loading v-if="restaurants.length == 0" :active="loading" />
    <p v-if="restaurants.length == 0 && !loading" class="no-match">
      Sorry, no matches!
    </p>
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
  </main>
</template>

<script>
import Loading from "vue3-loading-overlay"
import StarRating from "../components/StarRating.vue"
// import { Loader } from "@googlemaps/js-api-loader"
import { computeDistanceBetween, convertLatLng } from "spherical-geometry-js"

export default {
  name: "RestaurantIndex",
  props: {
    restaurants: Array,
    coords: Object,
  },
  components: {
    StarRating,
    Loading,
  },
  data: () => ({
    restaurantDistances: {},
    loading: true,
  }),
  methods: {
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
  },
  mounted() {
    // console.log(this.restaurants[0]);
    setTimeout(() => (this.loading = false), 2000)

    // console.log(this.restaurants[0])

    // const loader = new Loader({
    //   apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    //   version: "weekly",
    // })

    // let map = this.$refs.map
    // loader.load().then(() => {
    //   map = new google.maps.Map(map, {
    //     center: { lat: -34.397, lng: 150.644 },
    //     zoom: 8,
    //   })
    // })
  },
  watch: {
    coords() {
      // Clear cache
      this.restaurantDistances = {}
    },
  },
}
</script>

<style scoped>
/* #map {
  width: 400px;
  height: 400px;
} */

main {
  font-size: 1.2rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;

  padding: 2rem 1rem 1rem;
}

.restaurant {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;

  place-items: center;
  justify-content: center;
  gap: 0.5rem;

  background-color: var(--color-2);

  width: 80%;
  max-width: 50rem;

  text-align: flex;

  animation: fade-in 200ms backwards;
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
  max-width: 340px;

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
  .restaurant > .details {
    font-size: 1.4rem;
  }
}

@media (min-width: 850px) {
  main {
    align-self: flex-start;
    align-items: flex-start;
    padding-left: 15vw;
  }
}
</style>

<style>
/* Result highlighting */
.restaurant em {
  font-weight: 800;
  font-style: initial;
}
</style>
