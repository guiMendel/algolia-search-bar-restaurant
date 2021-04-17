import { createStore } from "vuex"

// Create a new store instance.
const store = createStore({
  state() {
    return {
      page: 0,
      results: null,
      coords: null,

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
    updateCoords({ commit }) {
      // Get user's location
      navigator?.geolocation.getCurrentPosition(
        ({ coords: { latitude: lat, longitude: lng } }) =>
          commit("setCoords", { lat, lng }),
        // On error, erase coords
        () => commit("unsetCoords"),
      )
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

    // Subscribe a callback to the restaurant selection event
    subscribeToRestaurantSelection(state, onSelect) {
      state.restaurantSelectionObservers.push(onSelect)
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
