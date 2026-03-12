import { create } from 'zustand';

interface ContactState {
  name: string;
  email: string;
  phone: string;
  message: string;
  isSubmitting: boolean;
  setField: (field: 'name' | 'email' | 'phone' | 'message', value: string) => void;
  setSubmitting: (v: boolean) => void;
  reset: () => void;
}

export const useContactStore = create<ContactState>((set) => ({
  name: '',
  email: '',
  phone: '',
  message: '',
  isSubmitting: false,
  setField: (field, value) => set({ [field]: value }),
  setSubmitting: (isSubmitting) => set({ isSubmitting }),
  reset: () => set({ name: '', email: '', phone: '', message: '', isSubmitting: false }),
}));
