<template>
  <div v-for="deck in decks" :key="deck.id">
    {{ deck.name }} - {{ deck.cards.length }} cartes

    <div class="boutons">
      <NButton type="primary" @click="router.push('/decks/' + deck.id)">
        Voir
      </NButton>
      <NButton type="primary" @click="router.push('/decks/' + deck.id)">
        Modifier
      </NButton>
      <NButton type="error" @click="handleDeleted(deck.id)">
        Supprimer
      </NButton>
    </div>
  </div>

  <div class="boutons" @click="router.push('/decks/create')">
    <NButton type="warning" attr-type="submit"> Créer </NButton>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useApi } from '@/composables/useApi'
import type { Deck } from '@/types'

const decks = ref<Deck[]>([])
const { getMyDecks, deleteDeck } = useApi()
const router = useRouter()

const loadDecks = async () => {
  decks.value = await getMyDecks()
}

onMounted(() => {
  loadDecks()
})

const handleDeleted = async (id: number) => {
  await deleteDeck(id)
  await loadDecks()
}
</script>

<style scoped>
.boutons {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}
</style>
