import { useEffect, useState } from 'react';
import { ErrorPre, Wrapper } from './ExcutionResult.styles';
import useSocket from '../../hooks/useSocket';

interface ExcutionResultProps {
  height: number;
}

function ExcutionResult({ height }: ExcutionResultProps) {
  const socket = useSocket('http://localhost:8080');
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const excuteContent = error !== null ? <ErrorPre>{error}</ErrorPre> : ['ddd'];

  useEffect(() => {
    if (socket !== null) {
      socket.on('error', (data) => {
        const result = data.split('\n').slice(1).join('\n');
        setError(result);
      });
    }
  }, [socket]);

  return (
    <Wrapper style={{ height: `${100 - height}%` }}>
      {error === null && result === null ? (
        <h3>여기에 실행 결과가 표시됩니다.</h3>
      ) : (
        excuteContent
      )}
    </Wrapper>
  );
}

export default ExcutionResult;
