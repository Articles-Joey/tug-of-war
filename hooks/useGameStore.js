import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useGameStore = create()(
  persist(
    (set, get) => ({

      darkMode: true,
      toggleDarkMode: () => set({ darkMode: !get().darkMode }),

      theme: null,
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => {
        const current = get().theme
        if (current === 'Light') {
          set({ theme: 'Dark' })
        } else {
          set({ theme: 'Light' })
        }
      },

      cameraMode: 'Orbit',
      setCameraMode: (mode) => set({ cameraMode: mode }),

      sidebar: true,
      toggleSidebar: () => set({ sidebar: !get().sidebar }),

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

      _hasHydrated: false,
      setHasHydrated: (state) => {
        set({
          _hasHydrated: state
        });
      }

    }),
    {
      name: 'tug-of-war-game', // name of the item in the storage (must be unique)
      onRehydrateStorage: (state) => {
        return () => state.setHasHydrated(true)
      }
      // partialize: (state) => ({
      //   darkMode: state.darkMode,
      //   theme: state.theme,
      //   sidebar: state.sidebar,
      //   nickname: state.nickname,
      //   touchControls: state.touchControls,
      //   toontownMode: state.toontownMode,
      //   soundEnabled: state.soundEnabled,
      //   musicEnabled: state.musicEnabled,
      // }),
      // storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
)