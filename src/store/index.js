import { createStore } from "vuex"

// Create a new store instance.
const store = createStore({
  state() {
    return {
      page: 0,
    }
  },
  mutations: {
    resetPage: (state) => (state.page = 0),
    nextPage: (state) => state.page++,
    previousPage: (state) => state.page > 0 && state.page--,
  },
})

export default store
