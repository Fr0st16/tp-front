<template>
  <div class="home">
    <!-- RG6 : Lobby intégré sur la page d'accueil -->
    <div class="section">
      <h2>Mes decks</h2>
      <DeckList />
    </div>
    <NDivider vertical style="height: auto" />
    <div class="section">
      <LobbyPanel />
    </div>
  </div>
</template>

<script setup lang="ts">
import DeckList from '@/components/DeckList.vue'
import LobbyPanel from '@/components/LobbyPanel.vue'
</script>

<style scoped>
.home {
  display: flex;
  gap: 0;
  padding: 16px;
  min-height: calc(100vh - 64px);
}

.section {
  flex: 1;
  padding: 0 16px;
}
</style>
