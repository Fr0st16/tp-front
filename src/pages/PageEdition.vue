<template>
  <div v-if="!isEditing">
    <h1>{{ deck?.name }}</h1>
    <button @click="isEditing = true">Modifier</button>
    <div class="notediting">
      <CardItem
        v-for="card in cards.filter((c) => selectedCards.includes(c.id))"
        :key="card.id"
        :card="card"
      />
    </div>
  </div>
  <div v-else class="editing">
    <div class="editing-header">
      <NInput v-model:value="deckName" />
      <p>{{ selectedCards.length }} / 10 cartes sélectionnées</p>
      <NButton
        :disabled="deckName === '' || selectedCards.length !== 10"
        @click="handleSubmit"
      >
        Sauvegarder
      </NButton>
    </div>
    <CardGrid v-model="selectedCards" :cards="cards" :max-selected="10" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import CardGrid from '@/components/layout/CardGrid.vue'
import CardItem from '@/components/layout/CardItem.vue'
import { useApi } from '@/composables/useApi'
import type { Card, Deck } from '@/types'

const route = useRoute()
const deck = ref<Deck | null>(null)
const isEditing = ref(false)
const cards = ref<Card[]>([])
const deckName = ref('')
const selectedCards = ref<number[]>([])
const { getDeck, getCards, updateDeck } = useApi()

onMounted(async () => {
  const id = route.params.id as string
  deck.value = await getDeck(id)
  cards.value = await getCards()
  deckName.value = deck.value.name
  // pour chaque carte on prend juste l'id et on le met  d ans selectedCards
  selectedCards.value = deck.value.cards.map((card) => card.cardId)
})

const handleSubmit = async () => {
  if (deck.value) {
    await updateDeck(deck.value.id, {
      name: deckName.value,
      cards: selectedCards.value,
    })
    isEditing.value = false
  }
}
</script>

<style scoped>
.notediting {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.editing {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.editing-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}
</style>
