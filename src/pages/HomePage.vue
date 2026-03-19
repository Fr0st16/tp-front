<template>
  <div class="container">
    <NEmpty description="Page d'accueil à implémenter (tickets 2 et 3)" />
    <p>Page d'accueil</p>
  </div>
  <div class="decks">
    <p>Page de decks</p>
    <DeckList />
  </div>
</template>

<script setup lang="ts">
import DeckList from '@/components/DeckList.vue'
</script>
