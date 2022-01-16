import create from 'zustand';
import { Abilities } from '../../lib/characters';

interface StoreType {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
    setScores: (scores: Partial<Abilities>) => void;
}

export const useAbilityScoresStore = create<StoreType>((set) => ({
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
    setScores: (scores: Partial<Abilities>) => set((state) => ({ ...state, ...scores })),
}));
