<template>
  <div class="register-view">
    <img :class="imageClass" src="../assets/logo.png" alt="logo" />
    <button v-if="!register" class="submit-button register-button" @click="register = true">Register players</button>
    <tempalte v-if="register">
        <div class="register">
            <form @submit.prevent="register" class="register-form">
              <div v-for="player in players" :key="player.id" class="player-input">
                <label :for="'username-' + player.id">{{ `Player ${player.id}` }}</label>
                <input :type="'text'" :id="'username-' + player.id" v-model="player.username"/>
              </div>
              <div class="adjust-player">
                  <div class="adjust-player-button" v-if="playerNumber > 2" type="button" @click="removePlayer">-</div>
                  <div class="adjust-player-button" v-if="playerNumber < 4" type="button" @click="addPlayer">+</div>
              </div>
              <button class="submit-button" type="submit" @click="submit" :disabled="disabled">Play</button>
            </form>
        </div>
    </tempalte>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import { useGameStore } from '../stores/players';
const gameStore = useGameStore();
const disabled = computed(() => {
  return players.value.some(player => player.username === '')
})

const imageClass = computed(() => {
  return register.value ? 'small' : 'large'
});

const register = ref(false);
const router = useRouter()
const players = ref([
  { id: 1, username: '' },
  { id: 2, username: '' }
]);
const playerNumber = computed(() => {
  return players.value.length;
})

function addPlayer() {
  if (playerNumber.value < 4) {
    players.value.push({ id: playerNumber.value + 1, username: '' })
  }
}
function removePlayer() {
  if (playerNumber.value > 2) {
    players.value.pop()
  }
}
function submit() {
    for (let i = 0; i < playerNumber.value; i++) {
        gameStore.addPlayer(players.value[i]);
    }
  router.push({ name: 'gameplay' })
}

onMounted(() => {
  gameStore.resetStore();
})
</script>

<style scoped>
.register-view {
    width: 100%;
    height: 100%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    padding-top: 50%;
    text-align: center;
    position: relative;
}

.large {
    z-index: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  width: 100%;
  max-width: 100%;
  margin: auto;
}

.small {
    z-index: 0;
    position: absolute;
    top: 10%;
    left: 50%;
    transform: translate(-50%, -50%);
  width: 50%;
  max-width: 50%;
  margin: auto;
}

.register {
    position: relative;
    z-index: 4;
}

.register-form {
    padding-bottom: 50px;
  display: flex;
  flex-direction: column;
}

.player-input {
  margin-bottom: 30px;
}

.register-button {
    margin-top: 80%;
  z-index: 1;
}

.adjust-player {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin-bottom: 30px;
}

.adjust-player-button {
    font-size: 20px;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    border: 1px solid black;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}
</style>
