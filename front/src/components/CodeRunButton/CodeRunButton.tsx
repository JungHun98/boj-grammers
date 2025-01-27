import { Button } from '@/components/common/Button';
import useSocket from '@/hooks/useSocket';
import useCodeStore from '@/store/codeStroe';
import { useExampleInput } from '@/store/store';
import { memo } from 'react';

function CodeRunButton() {
  const socket = useSocket('http://localhost:8080');

  const lang = useCodeStore((state) => state.language);
  const code = useCodeStore((state) => state.code)[lang];
  const input = useExampleInput();

  const handleClickButton = () => {
    socket.emit('codeRun', { code, lang, input });
  };

  return <Button onClick={handleClickButton}>코드 실행</Button>;
}

export default memo(CodeRunButton);
