<template>
  <div class="grid">
    <CardItem
      v-for="card in props.cards"
      :key="card.id"
      :card="card"
      :selected="props.modelValue.includes(card.id)"
      :disabled="isDisabled(card.id)"
      @click="toggleCard(card.id)"
    ></CardItem>
  </div>
</template>

<script setup lang="ts">
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
.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
