<template>
  <div class="action-bar">
    <!-- RG3 : indicateur de tour -->
    <div class="turn-indicator">
      <NTag :type="isMyTurn ? 'success' : 'warning'" size="large">
        {{ isMyTurn ? 'Votre tour' : "Tour de l'adversaire" }}
      </NTag>
    </div>

    <!-- Boutons d'action (RG4, RG5, RG6) -->
    <div class="actions">
      <NButton :disabled="!canDraw" @click="gameStore.drawCards()">
        Piocher
      </NButton>
      <NButton :disabled="!canAttack" type="error" @click="gameStore.attack()">
        Attaquer
      </NButton>
      <NButton
        :disabled="!isMyTurn"
        type="primary"
        @click="gameStore.endTurn()"
      >
        Fin de tour
      </NButton>
    </div>

    <!-- RG7 : message en temps réel -->
    <NAlert
      v-if="gameMessage"
      type="info"
      :title="gameMessage"
      style="max-width: 400px"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import { useGameStore } from '@/stores/game.store'

const gameStore = useGameStore()
const { isMyTurn, myBoard, opponentBoard, gameMessage } = storeToRefs(gameStore)

// RG4 : Piocher désactivé si main pleine (5) ou deck vide
const canDraw = computed(() => {
  if (!isMyTurn.value) return false
  const handSize = myBoard.value?.hand.length ?? 0
  const deckCount = myBoard.value?.deckCount ?? 0
  return handSize < 5 && deckCount > 0
})

// RG5 : Attaquer désactivé si l'un des joueurs n'a pas de carte active
const canAttack = computed(() => {
  if (!isMyTurn.value) return false
  return !!myBoard.value?.activeCard && !!opponentBoard.value?.activeCard
})
</script>

<style scoped>
.action-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.turn-indicator {
  font-size: 1.1em;
}

.actions {
  display: flex;
  gap: 12px;
}
</style>
