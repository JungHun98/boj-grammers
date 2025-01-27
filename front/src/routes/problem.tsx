import { useState, DragEventHandler } from 'react';
import styled from '@emotion/styled';

import ProblemSearch from '@/components/ProblemSearch';
import ProblemContainer from '@/components/ProblemContainer';
import CodeSpace from '@/components/CodeSpace';
import LangSelect from '@/components/LangSelect';
import CodeRunButton from '@/components/CodeRunButton/CodeRunButton';
import ExcutionResult from '@/components/ExcutionResult';

interface ProblemProps {
  onOpen: () => void;
}

const Problem = ({ onOpen }: ProblemProps) => {
  const [leftWidth, setLeftWidth] = useState(40);
  const [upHeigth, setUpHeigth] = useState(60);

  const handleDrag: DragEventHandler = (e) => {
    const newLeftWidth = (e.clientX / window.innerWidth) * 100;
    if (newLeftWidth > 5 && newLeftWidth < 95) {
      // 최소, 최대 너비 설정
      setLeftWidth(newLeftWidth);
    }
  };

  const handleVirticalDrag: DragEventHandler = (e) => {
    const newUpHegith = (e.clientY / window.innerHeight) * 100;
    if (newUpHegith > 5 && newUpHegith < 95) {
      // 최소, 최대 너비 설정
      setUpHeigth(newUpHegith);
    }
  };

  return (
    <div className="wrapper">
      <div className="header">
        <ProblemSearch />
        <LangSelect />
      </div>
      <main>
        <ProblemContainer width={leftWidth} />
        <div className="gutter" draggable="true" onDrag={handleDrag} />
        <div className="code-wrapper" style={{ width: `${100 - leftWidth}%` }}>
          <div className="solution-wrapper">
            <CodeSpace height={upHeigth} />
            <div
              className="gutter_vertical"
              draggable="true"
              onDrag={handleVirticalDrag}
            ></div>
            <ExcutionResult height={upHeigth} />
          </div>
          <div className="submit">
            <div>
              <Button onClick={onOpen}>테스트 케이스 추가하기</Button>
            </div>
            <div>
              <CodeRunButton />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Problem;

const Button = styled('button')`
  margin: 0;
  padding: 0.4375rem 0.8125rem;
  font-size: 1rem;
  line-height: 1.5rem;
  background-color: #44576c;
  color: white;
  cursor: pointer;
  border-radius: 0.25rem;

  &: hover {
    border-color: #37485d;
    background-color: #37485d;
  }
`;
