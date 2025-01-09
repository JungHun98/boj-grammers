import useCodeStore from '../../store/codeStroe';
import { Wrapper } from './LangSelect.style';

type Language = 'cpp' | 'python' | 'java' | 'javascript';

function LangSelect() {
  const updateLang = useCodeStore((state) => state.updateLanguage);

  return (
    <Wrapper>
      <select
        onChange={(e) => updateLang(e.target.value as Language)}
        defaultValue="java"
      >
        <option>javascript</option>
        <option>python</option>
        <option>java</option>
        <option>cpp</option>
      </select>
    </Wrapper>
  );
}

export default LangSelect;
