<template>
  <div class="pagination-control">
    <span class="material-icons-round" @click="previousPage"
      >arrow_back_ios</span
    >
    <input
      type="number"
      ref="input"
      :value="page ? parseInt(page) + 1 : 1"
      @input="({ target: { value } }) => setPage(value - 1)"
      @click="$refs.input.select"
    />
    <span class="material-icons-round" @click="nextPage"
      >arrow_forward_ios</span
    >
  </div>
</template>

<script>
import { mapState } from "vuex"
import { mapMutations } from "vuex"

export default {
  name: "PaginationControl",
  computed: {
    ...mapState(["page"]),
  },
  methods: {
    ...mapMutations(["nextPage", "previousPage", "setPage"]),
  },
}
</script>

<style scoped>
.pagination-control {
  height: 2rem;

  display: flex;
  align-items: center;
  justify-content: space-between;

  color: var(--gray);
}

span {
  padding: 0.3rem;
  cursor: pointer;
  transition: all 500ms;

  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;
}

span:hover {
  padding: 0.5rem;

  /* counteract element expansion */
  margin: -0.2rem;

  background-color: var(--blue);
  color: var(--color-1);
}

input {
  width: 5rem;

  border: none;
  background: none;

  cursor: pointer;

  text-align: center;
  font-size: 1.6rem;
  color: var(--gray);

  /* hide ridiculous input arrows */
  -moz-appearance: textfield;
}

/* hide ridiculous input arrows */
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
</style>
