import { DragEventHandler, useState } from 'react';
import ProblemContainer from '@/components/ProblemContainer';
import SolutionContainer from '@/components/SolutionContainer';
import { Gutter, Wrapper } from './MainContent.styles';

function MainContent() {
  const [leftWidth, setLeftWidth] = useState(40);

  const handleDrag: DragEventHandler = (e) => {
    const newLeftWidth = (e.clientX / window.innerWidth) * 100;
    if (newLeftWidth > 5 && newLeftWidth < 95) {
      // 최소, 최대 너비 설정
      setLeftWidth(newLeftWidth);
    }
  };

  return (
    <Wrapper>
      <ProblemContainer width={leftWidth} />
      <Gutter draggable="true" onDrag={handleDrag} />
      <SolutionContainer width={leftWidth} />
    </Wrapper>
  );
}

export default MainContent;
