<template>
  <!-- RG8 : modal s'affiche automatiquement à la fin de la partie -->
  <NModal :show="isGameOver" :mask-closable="false" :closable="false">
    <NCard
      style="max-width: 400px; margin: auto"
      :title="didIWin ? 'Victoire !' : 'Défaite...'"
    >
      <div class="result-body">
        <p v-if="didIWin" class="result-text win">Vous avez gagné !</p>
        <p v-else class="result-text lose">Vous avez perdu.</p>
      </div>
      <template #footer>
        <!-- RG9 : bouton retour au lobby -->
        <NButton type="primary" @click="handleReturnToLobby">
          Retour au lobby
        </NButton>
      </template>
    </NCard>
  </NModal>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import { useGameStore } from '@/stores/game.store'

const gameStore = useGameStore()
const { isGameOver, didIWin } = storeToRefs(gameStore)
const router = useRouter()

const handleReturnToLobby = () => {
  gameStore.resetGame()
  router.push('/')
}
</script>

<style scoped>
.result-body {
  text-align: center;
  padding: 16px 0;
}

.result-text {
  font-size: 1.5em;
  font-weight: bold;
}

.win {
  color: #52c41a;
}

.lose {
  color: #ff4d4f;
}
</style>
