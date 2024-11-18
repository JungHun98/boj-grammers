import { create } from 'zustand';

type State = {
  problemNumber: number;
};

type Action = {
  updateProblemNumber: (problemNumber: State['problemNumber']) => void;
};

// Create your store, which includes both state and (optionally) actions
const useProblemStore = create<State & Action>((set) => ({
  problemNumber: -1,
  updateProblemNumber: (problemNumber) =>
    set(() => ({ problemNumber: problemNumber })),
}));

export default useProblemStore;
