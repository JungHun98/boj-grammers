import { useEffect, useState } from 'react';
import { ErrorPre, Wrapper } from './ExcutionResult.styles';
import useSocket from '../../hooks/useSocket';

interface ExcutionResultProps {
  height: number;
}

function ExcutionResult({ height }: ExcutionResultProps) {
  const socket = useSocket('http://localhost:8080');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string[]>([]);

  const excuteContent =
    error !== null ? (
      <ErrorPre>{error}</ErrorPre>
    ) : (
      result.map((elem) => <div key={`${elem}`}>{elem}</div>)
    );

  useEffect(() => {
    if (socket !== null) {
      socket.on('output', (data) => {
        if (error !== null) {
          setError(null);
        }

        setResult(data);
      });

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
