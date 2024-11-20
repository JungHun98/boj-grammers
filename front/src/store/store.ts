import { create } from 'zustand';

type State = {
  problemNumber: number;
  exampleInput: string[];
  exampleOutput: string[];
};

type Action = {
  updateProblemNumber: (problemNumber: State['problemNumber']) => void;
  updateExampleInput: (exampleInput: State['exampleInput']) => void;
  updateExampleOutput: (exampleOutput: State['exampleOutput']) => void;
};

// Create your store, which includes both state and (optionally) actions
const useProblemStore = create<State & Action>((set) => ({
  problemNumber: 1000,
  exampleInput: [],
  exampleOutput: [],
  updateProblemNumber: (problemNumber) =>
    set(() => ({ problemNumber: problemNumber })),
  updateExampleInput: (exampleInput) =>
    set(() => ({ exampleInput: exampleInput })),
  updateExampleOutput: (exampleOutput) =>
    set(() => ({ exampleOutput: exampleOutput })),
}));

export default useProblemStore;
