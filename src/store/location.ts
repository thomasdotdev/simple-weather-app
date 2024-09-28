import { LocationData } from "@/types/api";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface LocationStore {
  currentLocation: LocationData;
  setCurrentLocation: (location: LocationData) => void;
  history: LocationData[];
  addToHistory: (location: LocationData) => void;
  removeFromHistory: (location: LocationData) => void;
}

const defaultLocation: LocationData = {
  name: "Singapore, SG",
  lat: 1.3521,
  lon: 103.8198,
  country: "Singapore",
  state: "Singapore",
};

export const useLocationStore = create<LocationStore>()(
  persist(
    (set, get) => ({
      currentLocation: defaultLocation,
      setCurrentLocation: (location) => set({ currentLocation: location }),
      history: [],
      addToHistory: (location) =>
        set({ history: [location, ...get().history] }),
      removeFromHistory: (location) =>
        set({ history: get().history.filter((item) => item !== location) }),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: "location-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
