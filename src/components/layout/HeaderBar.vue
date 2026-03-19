<template>
  <NLayoutHeader
    bordered
    style="padding: 0 24px; position: sticky; top: 0; z-index: 100"
  >
    <NSpace justify="space-between" align="center" style="height: 56px">
      <NSpace align="center" :size="16">
        <RouterLink to="/">TCG SPA</RouterLink>
        <NButton
          tag="a"
          :href="`${apiBaseUrl.replace('/api', '')}/api-docs`"
          target="_blank"
          text
          size="small"
        >
          API Docs
        </NButton>
        <NButton
          tag="a"
          href="https://making-rerun-61323218.figma.site/"
          target="_blank"
          text
          size="small"
        >
          Maquettes
        </NButton>
      </NSpace>
      <NSpace align="center" :size="16">
        <NText depth="3">{{ user?.username }} est connecté</NText>
        <NButton size="small" @click="handleLogout">Déconnexion</NButton>
      </NSpace>
    </NSpace>
  </NLayoutHeader>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth.store'
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string
const router = useRouter()
const AuthStore = useAuthStore()
const { user } = storeToRefs(AuthStore)

const handleLogout = () => {
  AuthStore.logout()
  router.push('/connexion')
}
</script>
