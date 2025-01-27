import { Button } from '@/components/common/Button';
import CodeRunButton from '@/components/CodeRunButton';
import { Wrapper } from './ButtonSection.styles';

interface ButtonSectionProps {
  onOpen: () => void;
}

function ButtonSection({ onOpen }: ButtonSectionProps) {
  return (
    <Wrapper>
      <div>
        <Button onClick={onOpen}>테스트 케이스 추가하기</Button>
      </div>
      <div>
        <CodeRunButton />
      </div>
    </Wrapper>
  );
}

export default ButtonSection;
