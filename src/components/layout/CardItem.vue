<template>
  <!-- C'est ultra galère, j'ai beaucoup de mal -->
  <div
    :class="[
      'card',
      'card-' + props.size,
      { selected: props.selected, disabled: props.disabled },
    ]"
    @click="handleClick"
  >
    <img :src="props.card.imgUrl" :alt="props.card.name" />
    <p>{{ props.card.pokedexNumber }}</p>
    <p>{{ props.card.name }}</p>
    <span :style="{ backgroundColor: typeColor }">{{ props.card.type }}</span>
    <p>HP: {{ props.card.hp }}</p>
    <p>Attaque : {{ props.card.attack }}</p>

    <div v-if="props.currentHp !== undefined" class="hp-bar-track">
      <div
        class="hp-bar-fill"
        :style="{ width: pourcentageHp + '%', backgroundColor: hpbarColor }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useColors } from '@/composables/useColors'
import type { Card } from '@/types'

const { getTypeColor, hpColor } = useColors()

const props = withDefaults(
  defineProps<{
    card: Card
    size?: 'sm' | 'md'
    selected?: boolean
    disabled?: boolean
    currentHp?: number
  }>(),
  {
    size: 'md',
    selected: false,
    disabled: false,
    currentHp: undefined,
  },
)

// la déclaration des computeds :
const typeColor = computed(() => getTypeColor(props.card.type))
const pourcentageHp = computed(() => {
  if (!(props.currentHp === undefined)) {
    return (props.currentHp / props.card.hp) * 100
  } else {
    return 100
  }
})
const hpbarColor = computed(() => {
  return hpColor(pourcentageHp.value || 0)
})

const emit = defineEmits(['click'])
const handleClick = () => {
  if (!props.disabled) {
    emit('click')
  }
}
</script>

<style scoped>
.card {
  border: 0.5px solid black;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
}
.card-sm {
  width: 150px;
  font-size: 12px;
}
.card-md {
  width: 200px;
  font-size: 14px;
}
.selected {
  border-color: rgb(17, 0, 255);
  box-shadow: 0 0 10px rgb(17, 0, 255);
}
.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.hp-bar-track {
  background-color: gray;
  border-radius: 4px;
  height: 10px;
}
.hp-bar-fill {
  height: 100%;
  border-radius: 4px;
}
img {
  width: 100%;
  height: auto;
}
</style>
