import { DragEventHandler, useState } from 'react';
import { RunSection, Wrapper } from './SolutionContainer.styles';
import CodeSpace from '@/components/CodeSpace';
import ExcutionResult from '@/components/ExcutionResult';

interface SolutionContainerProps {
  width: number;
}

function SolutionContainer({ width }: SolutionContainerProps) {
  const [upHeigth, setUpHeigth] = useState(60);

  const handleVirticalDrag: DragEventHandler = (e) => {
    const newUpHegith = (e.clientY / window.innerHeight) * 100;
    if (newUpHegith > 5 && newUpHegith < 95) {
      // 최소, 최대 너비 설정
      setUpHeigth(newUpHegith);
    }
  };

  return (
    <Wrapper style={{ width: `${100 - width}%` }}>
      <RunSection>
        <CodeSpace height={upHeigth} />
        <div
          className="gutter_vertical"
          draggable="true"
          onDrag={handleVirticalDrag}
        ></div>
        <ExcutionResult height={upHeigth} />
      </RunSection>
    </Wrapper>
  );
}

export default SolutionContainer;
