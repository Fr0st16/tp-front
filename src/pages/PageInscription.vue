<template>
  <div class="page-container">
    <div class="form-card">
      <p v-if="msgerreur">{{ msgerreur }}</p>
      <NForm @submit.prevent="handleSignUp">
        <h1>Inscription</h1>
        <NFormItem label="Nom utilisateur">
          <NInput
            v-model:value="username"
            type="text"
            placeholder="Nom de l'utilisateur"
          />
        </NFormItem>

        <NFormItem label="Email">
          <NInput v-model:value="email" type="text" placeholder="Email" />
        </NFormItem>

        <NFormItem label="Mot de passe">
          <NInput
            v-model:value="password"
            type="password"
            show-password-on="mousedown"
            placeholder="Password"
          />
        </NFormItem>

        <!-- le bouton d'inscription est désactivé lorsque isLoading est true -->
        <NButton :disabled="isLoading" type="primary" attr-type="submit"
          >S'inscrire</NButton
        ><br />
        <RouterLink to="/connexion"> Déjà inscrit ? Se connecter</RouterLink>
      </NForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useApi } from '@/composables/useApi'
import { useStorage } from '@/composables/useStorage'

import { useAuthStore } from '../stores/auth.store'

const { signUp } = useApi()
const { set } = useStorage()
const AuthStore = useAuthStore()
const { token, user } = storeToRefs(AuthStore)

const username = ref('')
const password = ref('')
const email = ref('')
// constante isLoading pour indiquer si la requête d'inscription est en cours
const isLoading = ref(false)
const msgerreur = ref('')
// création d'une instance de router
const router = useRouter()

const handleSignUp = async () => {
  try {
    // on passe la valeur a true quand on clique le bouton d'inscription
    isLoading.value = true
    msgerreur.value = ''

    const response = await signUp({
      username: username.value,
      email: email.value,
      password: password.value,
    })
    set('token', response.token)
    set('user', response.user)
    token.value = response.token
    user.value = response.user

    // utilisatiion du router.push pour renvoyer vers la page d'acceuil
    router.push('/')
  } catch {
    msgerreur.value = "Erreur lors de l'inscription."
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
@import './pages.css';
</style>
