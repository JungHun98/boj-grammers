import { Wrapper } from './LangSelect.style';
import { useUpdateLanguage, Language } from '@/store/codeStroe';

function LangSelect() {
  const updateLang = useUpdateLanguage();

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
