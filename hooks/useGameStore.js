import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useGameStore = create()(
  persist(
    (set, get) => ({

      darkMode: true,
      toggleDarkMode: () => set({ darkMode: !get().darkMode }),

      theme: null,
      setTheme: (theme) => set({ theme }),

      nickname: "",
      setNickname: (nickname) => set({ nickname }),

      touchControls: false,
      setTouchControls: (enabled) => set({ touchControls: enabled }),

      toontownMode: false,
      toggleToontownMode: () => set({ toontownMode: !get().toontownMode }),

      soundEnabled: true,
      toggleSoundEnabled: () => set({ soundEnabled: !get().soundEnabled }),

      musicEnabled: true,
      toggleMusicEnabled: () => set({ musicEnabled: !get().musicEnabled }),

    }),
    {
      name: 'tug-of-war-game', // name of the item in the storage (must be unique)
      // storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
)