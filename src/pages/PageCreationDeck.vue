<template>
  <NInput v-model:value="deckName" placeholder="Entrer le nom du deck" />
  <p>{{ selectedCards.length }} / 10 cartes sélectionnées</p>
  <NButton :disabled="isSubmitDisabled" type="primary" @click="handleSubmit">
    Créer
  </NButton>
  <CardGrid v-model="selectedCards" :cards="cards" :max-selected="10" />
</template>

<script setup lang="ts">
import { NInput } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import CardGrid from '@/components/layout/CardGrid.vue'
import { useApi } from '@/composables/useApi'
import type { Card } from '@/types'

const { createDeck, getCards } = useApi()
const router = useRouter()
const cards = ref<Card[]>([])
const selectedCards = ref<number[]>([])
const deckName = ref('')
const isSubmitDisabled = computed(() => {
  return deckName.value === '' || selectedCards.value.length !== 10
})

// on charge les cartes avant de les afficher
onMounted(async () => {
  cards.value = await getCards()
})

const handleSubmit = async () => {
  await createDeck({
    name: deckName.value,
    cards: selectedCards.value,
  })
  router.push('/')
}
</script>
