<template>
  <div class="player-hand">
    <div class="hand-header">
      <span>Main ({{ hand.length }}/5)</span>
      <span>Deck restant : {{ deckCount }}</span>
    </div>
    <div class="cards">
      <!-- RG1 : max 5 cartes affichées -->
      <div
        v-for="card in hand"
        :key="card.id"
        class="hand-card"
        :class="{ clickable: canPlay }"
        :title="canPlay ? 'Jouer cette carte' : ''"
        @click="handlePlayCard(card.id)"
      >
        <img :src="card.imgUrl" :alt="card.name" class="hand-card-img" />
        <div class="hand-card-name">{{ card.name }}</div>
        <div class="hand-card-hp">{{ card.currentHp }} HP</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import { useGameStore } from '@/stores/game.store'

const gameStore = useGameStore()
const { isMyTurn, myBoard } = storeToRefs(gameStore)

const hand = computed(() => myBoard.value?.hand ?? [])
const deckCount = computed(() => myBoard.value?.deckCount ?? 0)

// RG2 : jouer uniquement si c'est le tour du joueur et qu'il n'a pas de carte active
const canPlay = computed(
  () => isMyTurn.value && myBoard.value?.activeCard === null,
)

const handlePlayCard = (cardId: number) => {
  if (canPlay.value) {
    gameStore.playCard(cardId)
  }
}
</script>

<style scoped>
.player-hand {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #e0e0e0;
}

.hand-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.9em;
  color: #666;
}

.cards {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.hand-card {
  border: 2px solid #ccc;
  border-radius: 6px;
  padding: 6px;
  text-align: center;
  width: 80px;
  background: white;
  cursor: default;
  transition:
    transform 0.15s,
    box-shadow 0.15s;
}

.hand-card.clickable {
  cursor: pointer;
  border-color: #4caf50;
}

.hand-card.clickable:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.hand-card-img {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

.hand-card-name {
  font-size: 0.75em;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hand-card-hp {
  font-size: 0.7em;
  color: #888;
}
</style>
