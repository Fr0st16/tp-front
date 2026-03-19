<template>
  <NConfigProvider>
    <NMessageProvider>
      <NLayout>
        <HeaderBar v-if="isAuthenticated" />
        <NLayoutContent>
          <RouterView />
        </NLayoutContent>
      </NLayout>
    </NMessageProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import HeaderBar from './components/layout/HeaderBar.vue'
import { useAuthStore } from './stores/auth.store'

const AuthStore = useAuthStore()
const { isAuthenticated } = storeToRefs(AuthStore)
</script>

<style>
body {
  padding: 0 20px;
}
</style>
