import CodeMirror, { ViewUpdate } from '@uiw/react-codemirror';
import { copilot } from '@uiw/codemirror-theme-copilot';
import { loadLanguage } from '@uiw/codemirror-extensions-langs';
import { Wrapper } from './CodeSpace.style';
import useCodeStore from '../../store/codeStroe';
import { ChangeEventHandler } from 'react';

interface CodeSpaceProps {
  height: number;
}

function CodeSpace({ height }: CodeSpaceProps) {
  const lang = useCodeStore((state) => state.language);
  const codeSet = useCodeStore((state) => state.code);
  const updateCode = useCodeStore((state) => state.updateCode);

  const handleInputCode = (value: string, viewUpdate: ViewUpdate) => {
    updateCode(lang, value);
  };

  return (
    <Wrapper height={height}>
      <CodeMirror
        value={codeSet[lang]}
        onChange={handleInputCode}
        theme={copilot}
        height="100%"
        extensions={[loadLanguage(lang)!]}
      />
    </Wrapper>
  );
}

export default CodeSpace;
