<template>
  <div class="shadow" @click.self="$emit('close')">
    <div class="list">
      <span @click.self="$emit('close')" class="material-icons-round close"
        >close</span
      >
      <h1>{{ name }}</h1>
      <input v-if="searchable" type="text" placeholder="filter" />
      <ul>
        <li v-for="({ selected, value }, option) in options" :key="option">
          <span class="material-icons-round">{{
            selected ? "check_box" : "check_box_outline_blank"
          }}</span>
          {{ option }} <em>({{ value }})</em>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "ListSelect",
  emits: ["select", "search", "close"],
  props: {
    name: String,
    options: Object,
    searchable: Boolean,
  },
  created() {
    // We add a 'selected' field to the options
    for (const option in this.options) {
      this.options[option] = { value: this.options[option], selected: false };
    }
    // console.log(this.options);
  },
};
</script>

<style scoped>
.shadow {
  z-index: 100;

  width: 100vw;
  height: 100vh;

  left: 0;
  top: 0;
  position: fixed;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 2rem;

  background-color: rgb(0, 0, 0, 0.3);
}

.list {
  width: max-content;
  position: relative;

  max-height: 100%;

  padding: 1rem;
  border-radius: 10px;
  background-color: var(--color-1);

  align-items: center;

  font-size: 1.3rem;

  box-shadow: 0 1px 100px 1px rgba(24, 24, 26, 0.4);
}

.close {
  position: absolute;

  top: -1rem;
  right: -1rem;

  padding: 0.5rem;
  background-color: var(--blue);
  color: white;
  border-radius: 50%;

  font-size: 2rem;
}

.list,
ul {
  display: flex;
  flex-direction: column;

  gap: 1rem;

  list-style-type: none;
}

ul {
  align-items: flex-start;
  text-align: start;
  
  width: 100%;
  overflow: auto;
}

h1 {
  font-size: 1.7rem;
  font-weight: 400;

  /* margin-bottom: 1rem; */
}

input {
  min-width: 100%;
  padding: 0.5rem;

  font-size: 1.2rem;

  border-radius: 10px;
  border: 2px solid var(--text-light);

  color: var(--text-light);
}

li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

span {
  color: var(--text-light);
}

em {
  color: var(--text-light);
  font-weight: 300;
}
</style>