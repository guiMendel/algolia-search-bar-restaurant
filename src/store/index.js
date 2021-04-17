import { createStore } from "vuex"

// Create a new store instance.
const store = createStore({
  state() {
    return {
      page: 0,
      results: null,
      coords: null,
    }
  },
  getters: {
    restaurants(state) {
      return state.results?.hits
    },
  },
  actions: {
    updateCoords: ({ commit }) => {
      // Get user's location
      navigator?.geolocation.getCurrentPosition(
        ({ coords: { latitude: lat, longitude: lng } }) =>
          commit("setCoords", { lat, lng }),
        // On error, erase coords
        () => commit("unsetCoords"),
      )
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
  },
})

export default store
