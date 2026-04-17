<template>
  <!-- RG3 : formulaire pleine largeur mobile, contraint sur grand écran -->
  <div class="form-page">
    <div class="form-header">
      <NInput v-model:value="deckName" placeholder="Entrer le nom du deck" />
      <p>{{ selectedCards.length }} / 10 cartes sélectionnées</p>
      <NButton
        :disabled="isSubmitDisabled"
        type="primary"
        @click="handleSubmit"
      >
        Créer
      </NButton>
    </div>
    <CardGrid v-model="selectedCards" :cards="cards" :max-selected="10" />
  </div>
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

<style scoped>
.form-page {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 480px;
}
</style>
