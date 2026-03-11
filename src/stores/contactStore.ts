import { create } from 'zustand';

interface ContactState {
  name: string;
  email: string;
  message: string;
  isSubmitting: boolean;
  setField: (field: 'name' | 'email' | 'message', value: string) => void;
  setSubmitting: (v: boolean) => void;
  reset: () => void;
}

export const useContactStore = create<ContactState>((set) => ({
  name: '',
  email: '',
  message: '',
  isSubmitting: false,
  setField: (field, value) => set({ [field]: value }),
  setSubmitting: (isSubmitting) => set({ isSubmitting }),
  reset: () => set({ name: '', email: '', message: '', isSubmitting: false }),
}));
