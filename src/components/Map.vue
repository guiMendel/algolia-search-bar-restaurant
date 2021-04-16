<template>
  <div class="map-container">
    <div ref="map"></div>
  </div>
</template>

<script>
import { Loader } from "@googlemaps/js-api-loader"
import mapStyle from "../resources/graphics/map_style"
import pinSvg from "../resources/graphics/pin.svg"
import flagSvg from "../resources/graphics/flag.svg"

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
    apiMaps: null,
    markers: {},
  }),
  computed: {
    flagIcon() {
      return {
        url: flagSvg,
        scaledSize: new this.apiMaps.Size(50, 50),
        anchor: new this.apiMaps.Point(3, 50),
      }
    },
    pinIcon() {
      return {
        url: pinSvg,
        scaledSize: new this.apiMaps.Size(50, 50),
        anchor: new this.apiMaps.Point(25, 50),
      }
    },
  },
  methods: {
    async updateMap() {
      if (this.loader && this.coords) {
        // Location slightly panned down
        const location = {
          lat: this.coords.latitude - 0.001,
          lng: this.coords.longitude,
        }

        if (!this.mapObject) {
          await this.loader.load().then(() => {
            // Save maps api
            this.apiMaps = google.maps

            // Load the map
            this.mapObject = new this.apiMaps.Map(this.$refs.map, {
              center: location,
              ...mapOptions,
            })
          })
        } else {
          // Refresh the map
          this.mapObject.panTo(location)
          this.mapObject.setZoom(mapOptions.zoom)
        }

        // Place new location marker
        this.updateMarker("location", location, this.flagIcon)
      }
    },
    updateMarker(id, position, icon) {
      // If already present, simply move
      if (this.markers[id]) {
        this.markers[id].setPosition(position)
        return
      }

      this.markers[id] = new this.apiMaps.Marker({
        position,
        map: this.mapObject,
        icon: icon ?? this.pinIcon,
      })
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
