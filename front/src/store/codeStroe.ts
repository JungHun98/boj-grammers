import { create } from 'zustand';
import { LanguageName } from '@uiw/codemirror-extensions-langs';
import { defaultCode } from '../utils/consts';

type codeSet = {
  cpp: string;
  python: string;
  java: string;
  javascript: string;
};

type State = {
  language: LanguageName;
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
