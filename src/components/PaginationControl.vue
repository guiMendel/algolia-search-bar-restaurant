<template>
  <div class="pagination-control">
    <span class="material-icons-round">arrow_back_ios</span>
    <p>{{ page ? page + 1 : 1 }}</p>
    <span class="material-icons-round">arrow_forward_ios</span>
  </div>
</template>

<script>
export default {
  name: "PaginationControl",
  emits: ["set-page"],
  props: {
    page: Number,
  },
}
</script>

<style scoped>
.pagination-control {
  width: 10rem;
  height: 2rem;

  display: flex;
  align-items: center;
  justify-content: space-between;

  font-size: 1.8rem;
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
</style>
