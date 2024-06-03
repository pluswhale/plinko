import create from 'zustand';

interface Game {
    gamesRunning: number;
    points: number;
    setGamesRunning: (gamesRunning: number) => void;
    changePoints: (points: string) => void;
    incrementGamesRunning: () => void;
    decrementGamesRunning: () => void;
}

export const useGameStore = create<Game>((set, get) => ({
    points: 0,
    gamesRunning: 0,
    setGamesRunning: (gamesRunning: number) => {
        set({ gamesRunning });
    },
    changePoints: (points: string) => {
        set({ points: +points });
    },
    incrementGamesRunning: () => {
        const gamesRunning = get().gamesRunning;
        const calc = gamesRunning + 1;

        set({ gamesRunning: calc < 0 ? 1 : calc });
    },
    decrementGamesRunning: () => {
        const gamesRunning = get().gamesRunning;
        const calc = gamesRunning - 1;

        set({ gamesRunning: calc < 0 ? 0 : calc });
    },
}));

