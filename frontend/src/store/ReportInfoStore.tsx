// 킥보드 브레이커
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

  latitude1: number;
  setLatitude1: (latitude1: number) => void;

  longitude1: number;
  setLongitude1: (longitude1: number) => void;

  address: string | null;
  setAddress: (address: string) => void;

  address1: string | null;
  setAddress1: (address1: string) => void;

  categoryId: number;
  setCategoryId: (categoryId: number) => void;

  description: string | null;
  setDescription: (description: string | null) => void;

  photos: { firstPhoto: File | null; secondPhoto: File | null };
  setPhotos: (newPhoto: File | null) => void;

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

      latitude1: 33.450701,
      setLatitude1: (latitude1) => set({ latitude1 }),

      longitude1: 126.570667,
      setLongitude1: (longitude1) => set({ longitude1 }),

      address: null,
      setAddress: (address) => set({ address }),

      address1: null,
      setAddress1: (address1) => set({ address1 }),

      categoryId: 0,
      setCategoryId: (categoryId) => set({ categoryId }),

      description: '',
      setDescription: (description) => set({ description }),

      photos: { firstPhoto: null, secondPhoto: null },
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
          photos: { firstPhoto: null, secondPhoto: null },
        }),
    }),
    {
      name: 'report-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
