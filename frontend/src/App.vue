<template>
  <div>
    <router-view />
  </div>
</template>

<script>
import { onMounted } from 'vue';
import { store } from './eventStore.js';

export default {
  name: "App",
  setup() {
    onMounted(() => {
      store.loadData();
    });
  },
};
</script>
