import CodeMirror from '@uiw/react-codemirror';
import { copilot } from '@uiw/codemirror-theme-copilot';
import { loadLanguage } from '@uiw/codemirror-extensions-langs';
import { Wrapper } from './CodeSpace.style';
import useCodeStore from '../../store/codeStroe';

interface CodeSpaceProps {
  height: number;
}

function CodeSpace({ height }: CodeSpaceProps) {
  const lang = useCodeStore((state) => state.language);
  const codeSet = useCodeStore((state) => state.code);

  return (
    <Wrapper height={height}>
      <CodeMirror
        value={codeSet[lang]}
        onChange={(e) => {}}
        theme={copilot}
        height="100%"
        extensions={[loadLanguage(lang)!]}
      />
    </Wrapper>
  );
}

export default CodeSpace;
