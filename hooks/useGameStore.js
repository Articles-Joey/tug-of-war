import generateRandomNickname from '@/util/generateRandomNickname';
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useGameStore = create()(
  // persist(
    (set, get) => ({

      history: [],
      setHistory: (newHistory) => set((prev) => ({
        history: newHistory
      })),
      addToHistory: (newEntry) => set((state) => ({
        history: [...state.history, newEntry]
      })),
      removeOldHistoryEntries: () => set((state) => ({
        history: state.history.filter((entry) => {
          const now = new Date();
          return now - new Date(entry.date) <= 5000; // Keep entries from the last 5 seconds
        })
      })),

      averageInterval: 0,
      setAverageInterval: (newValue) => set((prev) => ({
        averageInterval: newValue
      })),

    }),
    {
      name: 'tug-of-war-game',
      // onRehydrateStorage: (state) => {
      //   return () => state.setHasHydrated(true)
      // }
      partialize: (state) => ({

      }),
    },
  // ),
)