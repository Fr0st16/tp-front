<template>
  <!-- RG1 : trois zones dans l'ordre : adversaire, barre d'actions, joueur -->
  <div class="game-page">
    <PlayerZone :board="opponentBoard" label="Adversaire" />
    <ActionBar />
    <PlayerZone :board="myBoard" label="Vous" :is-me="true" />
    <GameEndModal />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import ActionBar from '@/components/game/ActionBar.vue'
import GameEndModal from '@/components/game/GameEndModal.vue'
import PlayerZone from '@/components/game/PlayerZone.vue'
import { useGameStore } from '@/stores/game.store'

const gameStore = useGameStore()
const { opponentBoard, myBoard } = storeToRefs(gameStore)
</script>

<style scoped>
.game-page {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 8px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  box-sizing: border-box;
}

/* RG4 : lisible sur mobile */
@media (max-width: 600px) {
  .game-page {
    padding: 4px;
    gap: 8px;
  }
}
</style>
