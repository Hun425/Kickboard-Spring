import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ReportState {
  companyId: number;
  setCompanyId: (companyId: number) => void;

  serialNumber: string | null;
  setSerialNumber: (serialNumber: string) => void;

  latitude: number;
  setLatitude: (latitude: number) => void;

  longitude: number;
  setLongitude: (longitude: number) => void;

  address: string | null;
  setAddress: (address: string) => void;

  categoryId: number;
  setCategoryId: (categoryId: number) => void;

  description: string | null;
  setDescription: (description: string | null) => void;

  photos: { firstPhoto: string; secondPhoto: string };
  setPhotos: (newPhoto: string) => void;

  reset: () => void; // 초기화 함수
}

export const useReportStore = create<ReportState>()(
  persist(
    (set) => ({
      companyId: 0,
      setCompanyId: (companyId) => set({ companyId }),

      serialNumber: null,
      setSerialNumber: (serialNumber) => set({ serialNumber }),

      latitude: 33.450701,
      setLatitude: (latitude) => set({ latitude }),

      longitude: 126.570667,
      setLongitude: (longitude) => set({ longitude }),

      address: null,
      setAddress: (address) => set({ address }),

      categoryId: 0,
      setCategoryId: (categoryId) => set({ categoryId }),

      description: '',
      setDescription: (description) => set({ description }),

      photos: { firstPhoto: '', secondPhoto: '' },
      setPhotos: (newPhoto) =>
        set((state) => ({
          photos: {
            secondPhoto: state.photos.firstPhoto,
            firstPhoto: newPhoto,
          },
        })),

      // 초기화 함수
      reset: () =>
        set({
          companyId: 0,
          serialNumber: '',
          latitude: 33.450701,
          longitude: 126.570667,
          address: null,
          categoryId: 0,
          description: '',
          photos: { firstPhoto: '', secondPhoto: '' },
        }),
    }),
    {
      name: 'report-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
