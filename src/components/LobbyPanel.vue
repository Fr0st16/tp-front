<template>
  <div class="lobby">
    <div class="lobby-header">
      <h2>Lobby</h2>
      <NTag :type="isConnected ? 'success' : 'error'" size="small">
        {{ isConnected ? 'Connecté' : 'Déconnecté' }}
      </NTag>
    </div>

    <!-- Sélection du deck (RG3, RG4) -->
    <div class="deck-select">
      <NSelect
        v-model:value="selectedDeckId"
        :options="deckOptions"
        placeholder="Choisir un deck"
        style="width: 280px"
      />
    </div>

    <NAlert
      v-if="lobbyError"
      type="error"
      :title="lobbyError"
      closable
      style="margin: 12px 0"
      @close="lobbyError = null"
    />

    <!-- Créer une room (RG3) -->
    <NButton
      type="primary"
      :disabled="selectedDeckId === null"
      style="margin: 12px 0"
      @click="handleCreateRoom"
    >
      Créer une partie
    </NButton>

    <NDivider>Parties disponibles</NDivider>

    <!-- Liste des rooms (RG2) -->
    <div v-if="rooms.length === 0">
      <NEmpty description="Aucune partie disponible" />
    </div>
    <div v-else class="rooms-list">
      <NCard
        v-for="room in rooms"
        :key="room.id"
        size="small"
        style="margin-bottom: 8px"
      >
        <div class="room-item">
          <span>Partie de {{ room.host.username }}</span>
          <NButton
            size="small"
            :disabled="selectedDeckId === null"
            @click="handleJoinRoom(room.id)"
          >
            Rejoindre
          </NButton>
        </div>
      </NCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'

import { useApi } from '@/composables/useApi'
import { useGameStore } from '@/stores/game.store'
import type { Deck } from '@/types'

const gameStore = useGameStore()
const { rooms, lobbyError, isConnected } = storeToRefs(gameStore)

const { getMyDecks } = useApi()

const decks = ref<Deck[]>([])
const selectedDeckId = ref<number | null>(null)

const deckOptions = computed(() =>
  decks.value.map((d) => ({ label: d.name, value: d.id })),
)

// RG2 : connexion socket + chargement des rooms au montage
onMounted(async () => {
  gameStore.connect()
  decks.value = await getMyDecks()
})

const handleCreateRoom = () => {
  if (selectedDeckId.value !== null) {
    gameStore.createRoom(selectedDeckId.value)
  }
}

// RG4 : rejoindre une room existante
const handleJoinRoom = (roomId: string) => {
  if (selectedDeckId.value !== null) {
    gameStore.joinRoom(roomId, selectedDeckId.value)
  }
}
</script>

<style scoped>
.lobby {
  max-width: 500px;
  padding: 16px;
}

.lobby-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.lobby-header h2 {
  margin: 0;
}

.deck-select {
  margin-bottom: 12px;
}

.room-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
