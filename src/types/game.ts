export interface Room {
  id: string
  host: { userId: number; username: string }
  guest?: { userId: number; username: string }
  status: 'waiting' | 'playing'
}

export interface GameCard {
  id: number
  name: string
  hp: number
  currentHp: number
  attack: number
  imgUrl: string
}

export interface PlayerBoard {
  userId: number
  username: string
  score: number
  activeCard: GameCard | null
  hand: GameCard[]
  deckCount: number
}

export interface GameState {
  roomId: string
  currentTurnUserId: number
  host: PlayerBoard
  guest: PlayerBoard
}

export interface GameResult {
  winnerId: number
}
