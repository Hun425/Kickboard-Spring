import { create } from 'zustand';

interface State {
  isNotice: boolean;
  isReport: boolean;
  isReportList: boolean;
  title: String;
  setReport: Function;
  setReportList: Function;
  setNotice: Function;
  setTitle: Function;
}

export const useStateStore = create<State>((set) => ({
  isReport: false,
  isReportList: false,
  isNotice: false,
  title: '',

  setReport: () =>
    set({ isReport: true, isReportList: false, isNotice: false }),
  setReportList: () =>
    set({ isReport: false, isReportList: true, isNotice: false }),
  setNotice: () =>
    set({ isReport: false, isReportList: false, isNotice: true }),
  setTitle: (s: string) => set({ title: s }),
}));
