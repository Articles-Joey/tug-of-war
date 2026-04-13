import { generateRandomNickname } from '@/util/generateRandomNickname';
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useGameStore = create()(
  persist(
    (set, get) => ({

      _hasHydrated: false,
      setHasHydrated: (state) => {
        set({
          _hasHydrated: state
        });
      },

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

      nickname: generateRandomNickname(),
      setNickname: (nickname) => set({ nickname }),
      randomNickname: () => {

        const newNickname = generateRandomNickname();

        set((prev) => ({
          nickname: newNickname
        }))

      },

      touchControls: false,
      setTouchControls: (enabled) => set({ touchControls: enabled }),

      toontownMode: false,
      toggleToontownMode: () => set({ toontownMode: !get().toontownMode }),

      // soundEnabled: true,
      // toggleSoundEnabled: () => set({ soundEnabled: !get().soundEnabled }),

      // musicEnabled: true,
      // toggleMusicEnabled: () => set({ musicEnabled: !get().musicEnabled }),

      showMenu: false,
      setShowMenu: (value) => set({ showMenu: value }),
      toggleShowMenu: () => set({ showMenu: !get().showMenu }),

      sidebar: true,
      setSidebar: (value) => set({ sidebar: value }),
      toggleSidebar: () => set({ sidebar: !get().sidebar }),

      landingAnimation: true,
      setLandingAnimation: (value) => set({ landingAnimation: value }),
      toggleLandingAnimation: () => set({ landingAnimation: !get().landingAnimation }),

      showInfoModal: false,
      setShowInfoModal: (value) => set({ showInfoModal: value }),
      toggleInfoModal: () => set({ showInfoModal: !get().showInfoModal }),

      loginInfoModal: false,
      setLoginInfoModal: (value) => set({ loginInfoModal: value }),
      toggleLoginInfoModal: () => set({ loginInfoModal: !get().loginInfoModal }),

      showSettingsModal: false,
      setShowSettingsModal: (value) => set({ showSettingsModal: value }),
      toggleSettingsModal: () => set({ showSettingsModal: !get().showSettingsModal }),

      showCreditsModal: false,
      setShowCreditsModal: (value) => set({ showCreditsModal: value }),
      toggleCreditsModal: () => set({ showCreditsModal: !get().showCreditsModal }),

      graphicsQuality: "High",
      setGraphicsQuality: (value) => set({ graphicsQuality: value }),

      lobbyDetails: {
        players: [],
        games: [],
      },
      setLobbyDetails: (lobbyDetails) => set({ lobbyDetails }),

      debug: false,
      setDebug: (newValue) => {
        set((prev) => ({
          debug: newValue
        }))
      },

      sceneKey: 0,
      setSceneKey: (newValue) => set({ sceneKey: newValue }),
      reloadScene: () => set((prev) => ({ sceneKey: prev.sceneKey + 1 })),

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