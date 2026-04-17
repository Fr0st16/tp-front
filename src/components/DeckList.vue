<template>
  <div class="deck-list">
    <!-- RG2 ticket5 : colonnes adaptées à la largeur de l'écran -->
    <NGrid responsive="screen" cols="1 m:2 l:3" :x-gap="16" :y-gap="16">
      <NGridItem v-for="deck in decks" :key="deck.id">
        <NCard :title="deck.name" size="small">
          <!-- RG1 : miniatures des 10 cartes du deck -->
          <div class="card-thumbnails">
            <img
              v-for="dc in deck.cards"
              :key="dc.id"
              :src="cardMap.get(dc.cardId)?.imgUrl"
              :alt="cardMap.get(dc.cardId)?.name"
              class="thumbnail"
              :title="cardMap.get(dc.cardId)?.name"
            />
          </div>
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
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useApi } from '@/composables/useApi'
import type { Card, Deck } from '@/types'

const decks = ref<Deck[]>([])
const allCards = ref<Card[]>([])
const { getMyDecks, deleteDeck, getCards } = useApi()
const router = useRouter()

// Map cardId → Card pour accès O(1) dans le template
const cardMap = computed(() => new Map(allCards.value.map((c) => [c.id, c])))

const loadDecks = async () => {
  decks.value = await getMyDecks()
}

onMounted(async () => {
  await Promise.all([loadDecks(), getCards().then((c) => (allCards.value = c))])
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

.card-thumbnails {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
}

.thumbnail {
  width: 36px;
  height: 36px;
  object-fit: contain;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  background: #fafafa;
}
</style>
