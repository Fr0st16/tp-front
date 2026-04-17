<template>
  <div class="player-zone" :class="{ 'is-me': isMe }">
    <!-- RG2 : score et carte active -->
    <div class="player-header">
      <span class="player-label">{{ label }}</span>
      <div class="score">
        <span
          v-for="n in 3"
          :key="n"
          class="ko-dot"
          :class="{ filled: board && n <= board.score }"
          >●</span
        >
        <span class="score-text"
          >{{ board?.score ?? 0 }} KO{{
            (board?.score ?? 0) !== 1 ? 's' : ''
          }}</span
        >
      </div>
    </div>

    <div class="active-card-area">
      <!-- Carte active avec barre de HP -->
      <template v-if="board?.activeCard">
        <div class="card-display">
          <img
            :src="board.activeCard.imgUrl"
            :alt="board.activeCard.name"
            class="card-img"
          />
          <div class="card-name">{{ board.activeCard.name }}</div>
          <div class="hp-bar-container">
            <div
              class="hp-bar-fill"
              :style="{ width: hpPercent + '%', backgroundColor: hpColor }"
            />
          </div>
          <div class="hp-text">
            {{ board.activeCard.currentHp }} / {{ board.activeCard.hp }} HP
          </div>
        </div>
      </template>
      <!-- RG3 : placeholder si aucune carte active -->
      <template v-else>
        <div class="placeholder">
          <NEmpty description="Aucune carte active" />
        </div>
      </template>
    </div>

    <!-- Main du joueur affichée dans sa zone (RG1 page jeu) -->
    <PlayerHand v-if="isMe" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { PlayerBoard } from '@/types'

import PlayerHand from './PlayerHand.vue'

const props = defineProps<{
  board: PlayerBoard | null
  label: string
  isMe?: boolean
}>()

const hpPercent = computed(() => {
  if (!props.board?.activeCard) return 0
  const { currentHp, hp } = props.board.activeCard
  return Math.max(0, Math.round((currentHp / hp) * 100))
})

const hpColor = computed(() => {
  if (hpPercent.value > 50) return '#52c41a'
  if (hpPercent.value > 25) return '#faad14'
  return '#ff4d4f'
})
</script>

<style scoped>
.player-zone {
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  padding: 16px;
  background: #fafafa;
}

.is-me {
  background: #f0f8ff;
  border-color: #91caff;
}

.player-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.player-label {
  font-weight: bold;
  font-size: 1.1em;
}

.score {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ko-dot {
  color: #d9d9d9;
  font-size: 1.2em;
}

.ko-dot.filled {
  color: #ff4d4f;
}

.score-text {
  font-size: 0.9em;
  color: #666;
  margin-left: 4px;
}

.active-card-area {
  min-height: 140px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-display {
  text-align: center;
  max-width: 150px;
}

.card-img {
  width: 90px;
  height: 90px;
  object-fit: contain;
}

.card-name {
  font-weight: bold;
  margin: 4px 0;
  font-size: 0.95em;
}

.hp-bar-container {
  width: 100%;
  height: 10px;
  background: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
  margin: 4px 0;
}

.hp-bar-fill {
  height: 100%;
  border-radius: 5px;
  transition:
    width 0.3s ease,
    background-color 0.3s ease;
}

.hp-text {
  font-size: 0.82em;
  color: #666;
}

.placeholder {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
