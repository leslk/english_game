<template>
    <div v-if="showBanner" class="banner">
      <p>{{`Congratulations ${currentUsername}! You reached a badge in ${category}.`}}</p>
    </div>
</template>
  
  <script setup>
  import { computed } from 'vue';
  import { useGameStore } from '../stores/players';
  const gameStore = useGameStore();
  const props = defineProps({
    showBanner: {
      type: Boolean,
      required: true,
    },
    category: {
      type: String,
      required: true,
    }
  });

  const currentUsername = computed(() => {
    return gameStore.currentPlayer.username;
});


  </script>
  
  <style scoped>
  .banner {
    background-color: #4caf50;
    color: #fff;
    padding: 10px;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
  }
  </style>