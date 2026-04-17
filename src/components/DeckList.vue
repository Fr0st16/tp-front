<template>
  <div class="deck-list">
    <!-- RG2 : colonnes adaptées à la largeur de l'écran -->
    <NGrid responsive="screen" cols="1 m:2 l:3" :x-gap="16" :y-gap="16">
      <NGridItem v-for="deck in decks" :key="deck.id">
        <NCard :title="deck.name" size="small">
          <template #footer>
            <div class="boutons">
              <NButton
                type="primary"
                size="small"
                @click="router.push('/decks/' + deck.id)"
              >
                Modifier
              </NButton>
              <NButton
                type="error"
                size="small"
                @click="handleDeleted(deck.id)"
              >
                Supprimer
              </NButton>
            </div>
          </template>
          {{ deck.cards.length }} cartes
        </NCard>
      </NGridItem>
    </NGrid>
    <div style="margin-top: 16px">
      <NButton type="warning" @click="router.push('/decks/create')">
        Créer un deck
      </NButton>
    </div>
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
.deck-list {
  width: 100%;
}

.boutons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
</style>
