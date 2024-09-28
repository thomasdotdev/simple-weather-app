import { LocationData } from "@/types/api";
import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";
import CryptoJS from "crypto-js";

const encryptedStorage: StateStorage = {
  getItem(key: string): any | undefined {
    const value = localStorage.getItem(key);

    if (value) {
      const decryptedBytes = CryptoJS.AES.decrypt(
        value,
        process.env.NEXT_PUBLIC_ENCRYPTION_KEY!
      );
      const decryptedValue = decryptedBytes.toString(CryptoJS.enc.Utf8);
      return decryptedValue;
    }

    return value;
  },
  setItem(key: string, value: any): void {
    const encrypted = CryptoJS.AES.encrypt(
      value,
      process.env.NEXT_PUBLIC_ENCRYPTION_KEY!
    ).toString();
    localStorage.setItem(key, encrypted);
  },
  removeItem(key: string): void {
    localStorage.removeItem(key);
  },
};

interface LocationStore {
  currentLocation: LocationData;
  setCurrentLocation: (location: LocationData) => void;
  history: LocationData[];
  addToHistory: (location: LocationData) => void;
  removeFromHistory: (location: LocationData) => void;
}

const defaultLocation: LocationData = {
  name: "Singapore",
  lat: 1.3521,
  lon: 103.8198,
  country: "SG",
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
        set({
          history: get().history.filter(
            (item) => item.lat !== location.lat && item.lon !== location.lon
          ),
        }),
    }),
    {
      name: "location-store",
      storage: createJSONStorage(() => encryptedStorage),
    }
  )
);
