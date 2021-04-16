<template>
  <div class="map-container">
    <div ref="map"></div>
  </div>
</template>

<script>
import { Loader } from "@googlemaps/js-api-loader"
import mapStyle from "../resources/graphics/map_style"

const mapOptions = {
  zoom: 14,
  styles: mapStyle,
  disableDefaultUI: true,
  maxZoom: 16,
  minZoom: 13,
}

export default {
  name: "Map",
  props: {
    coords: Object,
  },
  data: () => ({
    loader: null,
    mapObject: null,
  }),
  methods: {
    updateMap() {
      if (this.loader && this.coords) {
        if (!this.mapObject) {
          // Load the map
          this.loader.load().then(() => {
            this.mapObject = new google.maps.Map(this.$refs.map, {
              center: { lat: this.coords.latitude, lng: this.coords.longitude },
              ...mapOptions,
            })
          })
        } else {
          // Refresh the map
          this.mapObject.panTo({
            lat: this.coords.latitude,
            lng: this.coords.longitude,
          })
        }
      }
    },
  },
  mounted() {
    // Get google maps loader
    this.loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
      version: "weekly",
    })

    this.updateMap()
  },
  watch: {
    coords() {
      this.updateMap()
    },
  },
}
</script>

<style scoped>
.map-container {
  z-index: 50;

  /* default size */
  width: 200px;
  height: 200px;

  /* default color */
  background-color: gray;
}

.map-container > div {
  width: 100%;
  height: 100%;
}
</style>
