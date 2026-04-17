import { defineStore } from 'pinia'
import { io, type Socket } from 'socket.io-client'
import { computed, ref } from 'vue'

import type { GameResult, GameState, Room } from '@/types'

import router from '../router'
import { useAuthStore } from './auth.store'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL

export const useGameStore = defineStore('game', () => {
  const authStore = useAuthStore()
  let socket: Socket | null = null

  // --- Lobby ---
  const rooms = ref<Room[]>([])
  const currentRoomId = ref<string | null>(null)
  const lobbyError = ref<string | null>(null)
  const isConnected = ref(false)

  // --- Partie ---
  const gameState = ref<GameState | null>(null)
  const gameResult = ref<GameResult | null>(null)
  const gameMessage = ref<string | null>(null)

  // --- Computed ---
  const isMyTurn = computed(() => {
    if (!gameState.value || !authStore.user) return false
    return gameState.value.currentTurnUserId === authStore.user.id
  })

  const isHost = computed(() => {
    if (!gameState.value || !authStore.user) return false
    return gameState.value.host.userId === authStore.user.id
  })

  const myBoard = computed(() => {
    if (!gameState.value || !authStore.user) return null
    return isHost.value ? gameState.value.host : gameState.value.guest
  })

  const opponentBoard = computed(() => {
    if (!gameState.value || !authStore.user) return null
    return isHost.value ? gameState.value.guest : gameState.value.host
  })

  const isGameOver = computed(() => gameResult.value !== null)

  const didIWin = computed(() => {
    if (!gameResult.value || !authStore.user) return false
    return gameResult.value.winnerId === authStore.user.id
  })

  // --- Connexion Socket ---
  const connect = () => {
    if (socket?.connected) return

    socket = io(SOCKET_URL, {
      auth: { token: authStore.token },
    })

    socket.on('connect', () => {
      isConnected.value = true
      lobbyError.value = null
    })

    socket.on('disconnect', () => {
      isConnected.value = false
    })

    socket.on('connect_error', (err) => {
      lobbyError.value = `Connexion impossible : ${err.message}`
      isConnected.value = false
    })

    // Événements lobby
    socket.on('roomsList', (data: Room[]) => {
      rooms.value = data
    })

    socket.on('roomsListUpdated', (data: Room[]) => {
      rooms.value = data
    })

    socket.on('roomCreated', (data: { roomId: string; room?: Room }) => {
      currentRoomId.value = data.roomId
      // Fallback : si le serveur n'envoie pas roomsListUpdated au créateur,
      // on ajoute la room manuellement si elle est fournie
      if (data.room && !rooms.value.find((r) => r.id === data.roomId)) {
        rooms.value = [...rooms.value, data.room]
      }
    })

    socket.on('gameStarted', (data?: GameState) => {
      if (data) gameState.value = data
      router.push('/game')
    })

    socket.on('error', (data: { message: string }) => {
      lobbyError.value = data.message
    })

    // Événements partie
    socket.on('gameStateUpdated', (data: GameState) => {
      gameState.value = data
    })

    socket.on('gameEnded', (data: GameResult) => {
      gameResult.value = data
    })

    socket.on('opponentDisconnected', () => {
      gameMessage.value = "L'adversaire s'est déconnecté."
    })
  }

  const disconnect = () => {
    socket?.disconnect()
    socket = null
    isConnected.value = false
  }

  // --- Actions lobby ---
  const createRoom = (deckId: number) => {
    socket?.emit('createRoom', { deckId })
  }

  const joinRoom = (roomId: string, deckId: number) => {
    socket?.emit('joinRoom', { roomId, deckId })
  }

  // --- Actions de jeu (RG3) ---
  const drawCards = () => {
    socket?.emit('drawCards')
  }

  const playCard = (cardId: number) => {
    socket?.emit('playCard', { cardId })
  }

  const attack = () => {
    socket?.emit('attack')
  }

  const endTurn = () => {
    socket?.emit('endTurn')
  }

  // --- Reset (RG6) ---
  const resetGame = () => {
    gameState.value = null
    gameResult.value = null
    gameMessage.value = null
    currentRoomId.value = null
    lobbyError.value = null
  }

  return {
    // State
    rooms,
    currentRoomId,
    lobbyError,
    isConnected,
    gameState,
    gameResult,
    gameMessage,
    // Computed
    isMyTurn,
    isHost,
    myBoard,
    opponentBoard,
    isGameOver,
    didIWin,
    // Actions
    connect,
    disconnect,
    createRoom,
    joinRoom,
    drawCards,
    playCard,
    attack,
    endTurn,
    resetGame,
  }
})
