import { create } from 'zustand';

type State = {
  problemNumber: number;
  language: string;
  exampleInput: string[];
  exampleOutput: string[];
};

type Action = {
  updateProblemNumber: (problemNumber: State['problemNumber']) => void;
  updateExampleInput: (exampleInput: State['exampleInput']) => void;
  updateExampleOutput: (exampleOutput: State['exampleOutput']) => void;
  updateLanguage: (language: State['language']) => void;
};

// Create your store, which includes both state and (optionally) actions
const useProblemStore = create<State & Action>((set) => ({
  problemNumber: 1000,
  language: 'java',
  exampleInput: [],
  exampleOutput: [],
  updateProblemNumber: (problemNumber) =>
    set(() => ({ problemNumber: problemNumber })),
  updateExampleInput: (exampleInput) =>
    set(() => ({ exampleInput: exampleInput })),
  updateExampleOutput: (exampleOutput) =>
    set(() => ({ exampleOutput: exampleOutput })),
  updateLanguage: (language) => set(() => ({ language: language })),
}));

export default useProblemStore;
