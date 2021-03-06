<template>
  <div class="map-container">
    <div class="map" ref="map">
      <p class="no-map">Map requires geolocation access</p>
    </div>
    <circle-button
      v-if="mapObject"
      id="refocus-button"
      :class="{
        active: mapCentered,
        disabled: !coords,
      }"
      @click="refocusMap"
      icon="my_location"
      hoverMessage="Center on me"
      hover-right
    />
  </div>
</template>

<script>
import { Loader } from "@googlemaps/js-api-loader"
import { mapGetters, mapState, mapActions, mapMutations } from "vuex"
import mapStyle from "../resources/graphics/map_style"
import pinSvg from "../resources/graphics/pin.svg"
import flagSvg from "../resources/graphics/flag.svg"
import CircleButton from "./CircleButton.vue"

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
  components: {
    CircleButton,
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
    // Indicates whether the map is centered o the user location
    mapCentered: true,
  }),
  computed: {
    ...mapGetters(["restaurants"]),
    ...mapState(["coords", "highlightedRestaurant", "splitScreen"]),
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
    restaurantLocations() {
      if (!this.restaurants) return []
      return this.restaurants.map(
        ({ objectID: id, _geoloc: { lat, lng } }) => ({
          id,
          location: { lat, lng },
        }),
      )
    },
  },
  methods: {
    ...mapActions(["selectRestaurant"]),
    ...mapMutations(["highlightRestaurant", "toggleMap"]),
    refocusMap() {
      if (this.coords) {
        // Refresh the map
        this.mapObject.panTo(this.coords)
        this.mapObject.setZoom(mapOptions.zoom)
        this.mapCentered = true
      }
    },
    async createMap() {
      await this.loader.load().then(() => {
        // Save maps api
        this.apiMaps = google.maps

        // Load the map
        this.mapObject = new this.apiMaps.Map(this.$refs.map, {
          center: this.coords,
          ...mapOptions,
        })

        // Listen for events
        this.mapObject.addListener("center_changed", () => {
          this.mapCentered = false
        })
      })
    },
    async updateMap() {
      if (this.loader && this.coords) {
        if (!this.mapObject) {
          await this.createMap()
        } else {
          this.refocusMap()
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
      for (const pin of this.restaurantLocations) {
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

      // Create marker
      this.markers[id] = new this.apiMaps.Marker({
        position,
        map: this.mapObject,
        icon: icon ?? this.pinIcon,
      })

      // Select restaurant & close map on click
      this.markers[id].addListener("click", () => {
        this.toggleMap(false)
        this.selectRestaurant({ restaurantId: id, selector: "marker" })
      })

      // Highlight restaurant on mouseover
      this.markers[id].addListener("mouseover", () =>
        this.highlightRestaurant({ restaurantId: id }),
      )
    },
    removeMarker(id) {
      if (!this.markers[id]) return
      this.markers[id].setVisible(false)
      this.markers[id].setMap(null)
      delete this.markers[id]
    },
    updateLocationMarker() {
      // Only change if there is a location and the flag isn't in that location already
      if (!this.coords) return this.removeMarker("location")

      // Get current marker position
      const markerPosition = this.getMarkerPosition("location")

      if (
        !markerPosition ||
        (markerPosition.lat != this.coords.lat &&
          markerPosition.lng != this.coords.lng)
      ) {
        this.setMarker("location", this.coords, this.flagIcon)
        // Set up click listener
        this.apiMaps.event.clearInstanceListeners(this.markers.location)
        this.markers.location.addListener("click", this.refocusMap)
      }
    },
    getMarkerPosition(marker) {
      return {
        lat: this.markers[marker]?.position.lat(),
        lng: this.markers[marker]?.position.lng(),
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
    setMarkerHighlight(id, set) {
      if (!id) return
      const marker = this.markers[id]

      if (!marker) return

      if (set) {
        this.markers[id].setAnimation(this.apiMaps.Animation.BOUNCE)
      } else {
        this.markers[id].setAnimation(null)
      }
    },
    focusOnRestaurant(restaurantId) {
      // Prevent focusing on inexistent stuff
      if (!this.mapObject || !this.markers[restaurantId]) return

      // Open map, if not in split screen
      if (!this.splitScreen) this.toggleMap(true)

      // Pan to selected restaurant
      this.mapObject.panTo(this.markers[restaurantId].position)
    },
  },
  mounted() {
    // Get google maps loader
    this.loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
      version: "weekly",
    })

    this.updateMap()

    // Open map when a restaurant is selected from the index
    this.$store.commit("subscribeToRestaurantSelection", {
      observer: "map",
      onSelect: (restaurantId, selector) =>
        selector === "index" && this.focusOnRestaurant(restaurantId),
    })
  },
  watch: {
    coords() {
      this.updateMap()
    },
    restaurants() {
      // Can only render markers after getting this reference
      if (this.apiMaps) {
        this.updateMarkers()
      }
    },
    highlightedRestaurant(newId, oldId) {
      if (this.mapObject) {
        this.setMarkerHighlight(newId, true)
        this.setMarkerHighlight(oldId, false)
      }
    },
  },
}
</script>

<style scoped>
.map-container {
  position: relative;
  z-index: 50;

  /* default size */
  width: 200px;
  height: 200px;

  /* default color */
  /* background-color: gray; */
  background-image: url("../resources/graphics/background_@2X.png");
}

.map {
  width: 100%;
  height: 100%;
}

#refocus-button {
  z-index: 100;

  position: absolute;
  bottom: 4rem;
  left: 2rem;
}

#refocus-button.active {
  color: var(--blue);
}

#refocus-button.disabled {
  color: var(--light-gray);
  background: var(--gray);
}

.no-map {
  font-size: 1.5rem;
  /* font-weight: 300; */
  color: var(--text-light);

  width: 100%;
  height: 100%;

  display: flex;
  align-items: flex-end;
  justify-content: flex-start;

  padding: 0 0 2rem 2rem;
}
</style>
