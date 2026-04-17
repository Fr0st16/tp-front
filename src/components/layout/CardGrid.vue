<template>
  <!-- RG1 : champ de recherche au-dessus de la grille -->
  <div class="card-grid-wrapper">
    <NInput
      v-model:value="search"
      placeholder="Rechercher une carte..."
      clearable
      style="margin-bottom: 10px"
    />
    <div class="grid">
      <!-- RG2 : filtrée en temps réel par nom -->
      <CardItem
        v-for="card in filteredCards"
        :key="card.id"
        :card="card"
        :selected="props.modelValue.includes(card.id)"
        :disabled="isDisabled(card.id)"
        @click="toggleCard(card.id)"
      ></CardItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import type { Card } from '@/types'

import CardItem from './CardItem.vue'

const props = withDefaults(
  defineProps<{
    cards: Card[]
    modelValue: number[]
    maxSelected: number
  }>(),
  {
    cards: () => [],
    modelValue: () => [],
    maxSelected: 1,
  },
)

const emit = defineEmits(['update:modelValue'])

const search = ref('')

// RG2 : filtre en temps réel par nom
// RG3 : modelValue n'est pas modifié par le filtre → les cartes sélectionnées restent sélectionnées
const filteredCards = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return props.cards
  return props.cards.filter((c) => c.name.toLowerCase().includes(q))
})

const toggleCard = (cardId: number) => {
  if (props.modelValue.includes(cardId) === true) {
    return emit(
      'update:modelValue',
      props.modelValue.filter((id) => id !== cardId),
    )
  } else if (props.modelValue.includes(cardId) === false) {
    if (props.modelValue.length >= props.maxSelected) {
      return
    }
    return emit('update:modelValue', [...props.modelValue, cardId])
  }
}
const isDisabled = (cardId: number) => {
  return (
    !props.modelValue.includes(cardId) &&
    props.modelValue.length >= props.maxSelected
  )
}
</script>

<style scoped>
.card-grid-wrapper {
  display: flex;
  flex-direction: column;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
