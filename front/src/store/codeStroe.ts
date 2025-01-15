import { create } from 'zustand';
import { defaultCode } from '@/utils/consts';

type Language = 'cpp' | 'python' | 'java' | 'javascript';

type codeSet = {
  [key in Language]: string;
};

type State = {
  language: Language;
  code: codeSet;
};

type Action = {
  updateLanguage: (language: State['language']) => void;
  updateCode: (language: keyof codeSet, newCode: string) => void;
};

const useCodeStore = create<State & Action>((set) => ({
  language: 'java',
  code: defaultCode,
  updateLanguage: (language) => set(() => ({ language })),
  updateCode: (language, newCode) =>
    set((state) => ({
      code: {
        ...state.code,
        [language]: newCode,
      },
    })),
}));

export default useCodeStore;
