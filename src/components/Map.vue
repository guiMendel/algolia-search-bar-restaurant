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
  zoom: 15,
  styles: mapStyle,
  disableDefaultUI: true,
  maxZoom: 17,
  minZoom: 13,
  gestureHandling: "greedy",
}

export default {
  name: "Map",
  props: {
    coords: Object,
    pins: Array,
  },
  data: () => ({
    // Reference to Loader object
    loader: null,
    mapObject: null,
    // Reference do the google maps api
    apiMaps: null,
    // References to marker objects on the map
    markers: {},
    // Ids of pins that currently have markers on map
    activePinIds: [],
  }),
  computed: {
    flagIcon() {
      return {
        url: flagSvg,
        scaledSize: new this.apiMaps.Size(50, 50),
        anchor: new this.apiMaps.Point(5, 50),
      }
    },
    pinIcon() {
      return {
        url: pinSvg,
        scaledSize: new this.apiMaps.Size(50, 50),
        anchor: new this.apiMaps.Point(25, 50),
      }
    },
    location() {
      if (!this.coords) return null
      return {
        lat: this.coords.latitude,
        lng: this.coords.longitude,
      }
    },
  },
  methods: {
    async updateMap() {
      if (this.loader && this.coords) {
        if (!this.mapObject) {
          await this.loader.load().then(() => {
            // Save maps api
            this.apiMaps = google.maps

            // Load the map
            this.mapObject = new this.apiMaps.Map(this.$refs.map, {
              center: this.location,
              ...mapOptions,
            })
          })
        } else {
          // Refresh the map
          this.mapObject.panTo(this.location)
          this.mapObject.setZoom(mapOptions.zoom)
        }

        this.updateMarkers()
      }
    },
    updateMarkers() {
      // Update user's location marker
      this.updateLocationMarker()

      // After updating the new pins, this will hold the ids of pins which are no longer to have markers
      const previousPinIds = [...this.activePinIds]
      this.activePinIds = []

      // Update pins
      for (const pin of this.pins) {
        // Since this pin will have a marker, we withdraw it from the remove list
        this.removeIfPresent(previousPinIds, pin.id)

        // Register its id as active
        this.activePinIds.push(pin.id)

        // Add its marker
        this.setMarker(pin.id, pin.location)
      }

      // Delete inactive pins
      for (const inactivePinId of previousPinIds) {
        this.removeMarker(inactivePinId)
      }
    },
    setMarker(id, position, icon) {
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
      // console.log(this.pins)
    },
    removeMarker(id) {
      this.markers[id].setVisible(false)
      this.markers[id].setMap(null)
      delete this.markers[id]
    },
    updateLocationMarker() {
      if (this.location) {
        this.setMarker("location", this.location, this.flagIcon)
      } else {
        this.removeMarker("location")
      }
    },
    // Pops an item from a list if it is present
    removeIfPresent(list, item) {
      let index
      // If present, get its index
      if (
        (index = list.findIndex((presentItem) => presentItem == item)) != -1
      ) {
        // Remove it
        list.splice(index, 1)
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
    pins() {
      // Can only render markers after getting this reference
      if (this.apiMaps) {
        this.updateMarkers()
      }
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
  /* background-color: gray; */
  background-image: url('../resources/graphics/background_@2X.png');
}

.map-container > div {
  width: 100%;
  height: 100%;
}
</style>
