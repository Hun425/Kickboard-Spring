import { create } from 'zustand';

interface State {
  isReport: boolean;
  setReport: Function;

  isReportList: boolean;
  setReportList: Function;

  isNotice: boolean;
  setNotice: Function;

  title: String;
  setTitle: Function;

  isReportMap: boolean;
  setIsReportMap: Function;
}

export const useStateStore = create<State>((set) => ({
  isReport: false,
  setReport: () =>
    set({ isReport: true, isReportList: false, isNotice: false }),

  isReportList: false,
  setReportList: () =>
    set({ isReport: false, isReportList: true, isNotice: false }),

  isNotice: false,
  setNotice: () =>
    set({ isReport: false, isReportList: false, isNotice: true }),

  title: '',
  setTitle: (s: string) => set({ title: s }),

  isReportMap: false,
  setIsReportMap: () => set((state) => ({ isReportMap: !state.isReportMap })),
}));
