import { defineStore } from 'pinia';


export const useGameStore = defineStore('game', {
  state: () => ({
    players: [],
    playerResults: [],
    currentPlayerIndex: 0,
  }),
  getters: {
    currentPlayer() {
      return this.players[this.currentPlayerIndex];
    },
  },
  actions: {
    addPlayer(player) {
      this.players.push(player);
      this.playerResults.push({
        playerId: player.id,
        name: player.username,
        results: {},
      });
    },
    resetStore() {
      this.players = [];
      this.playerResults = [];
      this.currentPlayerIndex = 0;
    },
    updatePlayerResult(category) {
      const currentPlayer = this.currentPlayer;
      if (currentPlayer) {
        const playerResult = this.playerResults.find((pr) => pr.playerId === currentPlayer.id);
        if (playerResult) {
          if (!playerResult.results[category]) {
            playerResult.results[category] = 0;
          }
          playerResult.results[category]++;
        }
      }
    },
    hasEnoughPoints(category) {
      const playerResult = this.playerResults.find((pr) => pr.playerId === this.currentPlayer.id);
      if (playerResult && playerResult.results[category] == 3) {
        return true;
      }
      return false;
    },
    switchToNextPlayer() {
      this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    },
  persist: true,
  },
});