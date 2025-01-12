import { Button } from '../common/Button';
import useSocket from '../../hooks/useSocket';
import useCodeStore from '../../store/codeStroe';
import useProblemStore from '../../store/store';

function CodeRunButton() {
  const socket = useSocket('http://localhost:8080');

  const lang = useCodeStore((state) => state.language);
  const code = useCodeStore((state) => state.code)[lang];
  const input = useProblemStore((state) => state.exampleInput);

  const handleClickButton = () => {
    socket.emit('codeRun', { code, lang, input });
  };

  return <Button onClick={handleClickButton}>코드 실행</Button>;
}

export default CodeRunButton;
