import { createStore } from "vuex"

// Create a new store instance.
const store = createStore({
  state() {
    return {
      results: null,
      page: 0,

      coords: null,
      usingNYcoords: false,

      mapOpen: false,
      tutorialOpen: false,
      // Determines if screen is split between map and results
      splitScreen: window.innerWidth >= 1024,

      // Holds a list of callbacks to call upon a restaurant's selection
      restaurantSelectionObservers: [],

      highlightedRestaurant: null,
      highlightTimeout: null,
    }
  },
  getters: {
    restaurants(state) {
      return state.results?.hits
    },
  },
  actions: {
    toggleNYcoords({ state, commit, dispatch }) {
      // If already using, switch to actual coordinates
      if (state.usingNYcoords) dispatch("updateCoords")
      else commit("useNYcoords")
    },

    updateCoords({ state, commit }) {
      // Get user's location
      navigator?.geolocation.getCurrentPosition(
        ({ coords: { latitude: lat, longitude: lng } }) =>
          commit("setCoords", { lat, lng }),
        // On error, erase coords
        () => commit("unsetCoords"),
      )

      // Makes sure state is updated
      state.usingNYcoords = false
    },
    // Alert all observers for this restaurant and highlight it for 2 seconds
    selectRestaurant(
      { state, commit },
      { restaurantId, selector = "anonymous" },
    ) {
      // Alert observers
      for (const observerCallback of state.restaurantSelectionObservers)
        observerCallback(restaurantId, selector)

      // Highlight restaurant
      commit("highlightRestaurant", { restaurantId, duration: 2000 })
    },
  },
  mutations: {
    setPage: (state, newPage) => newPage >= 0 && (state.page = newPage),
    resetPage: (state) => (state.page = 0),
    nextPage: (state) => state.page++,
    previousPage: (state) => state.page > 0 && state.page--,

    setResults: (state, newResults) => (state.results = newResults),

    setCoords: (state, newCoords) => (state.coords = newCoords),
    unsetCoords: (state) => (state.coords = null),
    useNYcoords(state) {
      state.coords = {
        lat: 40.71,
        lng: -74.012,
      }
      state.usingNYcoords = true
    },

    // Subscribe a callback to the restaurant selection event
    subscribeToRestaurantSelection(state, onSelect) {
      state.restaurantSelectionObservers.push(onSelect)
    },

    toggleMap(state, open) {
      // Only open if there are coords, but can always close
      state.mapOpen = state.coords && open
    },

    toggleTutorial(state, open) {
      state.tutorialOpen = open
    },

    setSplitScreen(state) {
      state.splitScreen = window.innerWidth >= 1024
    },

    // Set the referenced restaurant as "highlighted" for the given duration
    highlightRestaurant(state, { restaurantId, duration = 1000 }) {
      // Highlight this restaurant
      state.highlightedRestaurant = restaurantId

      // Set a timer to disable the highlight, erase previous timeout if present
      if (state.highlightTimeout) clearInterval(state.highlightTimeout)

      state.highlightTimeout = setTimeout(() => {
        state.highlightTimeout = null
        state.highlightedRestaurant = null
      }, duration)
    },
  },
})

export default store
