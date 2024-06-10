import create from 'zustand';

interface Payment {
    amount: number;
    changeAmount: (amount: string) => void;
}

export const usePaymentStore = create<Payment>((set) => ({
    amount: 0,
    changeAmount: (amount: string) => {
        set({ amount: +amount });
    },
}));

