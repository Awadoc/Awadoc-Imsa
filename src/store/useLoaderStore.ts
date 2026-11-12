import { create } from "zustand";

// The full screen AwaDoc loader. "Start booking" turns it on, the booking page turns it off once its options are ready, so the page
// arrives already loaded instead of showing "Just a moment...".
interface LoaderState {
  visible: boolean;
  show: () => void;
  hide: () => void;
}

export const useLoaderStore = create<LoaderState>((set) => ({
  visible: false,
  show: () => set({ visible: true }),
  hide: () => set({ visible: false }),
}));
