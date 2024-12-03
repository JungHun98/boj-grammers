import { ChangeEventHandler, useState } from 'react';
import {
  AddButton,
  Bottom,
  CancleButton,
  TestCaseArea,
  Wrapper,
} from './AdditionalTestCaseModal.style';
import useProblemStore from '../../store/store';

interface AdditionalTestCaseModalProps {
  onClose: () => void;
}

function AdditionalTestCaseModal({ onClose }: AdditionalTestCaseModalProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const exampleInput = useProblemStore((state) => state.exampleInput);
  const exampleOutput = useProblemStore((state) => state.exampleOutput);
  const updateExampleInput = useProblemStore(
    (state) => state.updateExampleInput,
  );
  const updateExampleOutput = useProblemStore(
    (state) => state.updateExampleOutput,
  );

  const handleEnterInput: ChangeEventHandler<HTMLTextAreaElement> = ({
    target,
  }) => {
    setInput(target.value);
  };

  const handleEnterOutput: ChangeEventHandler<HTMLTextAreaElement> = ({
    target,
  }) => {
    setOutput(target.value);
  };

  const handleAddTestCase = () => {
    const newInput = exampleInput.slice();
    const newOutput = exampleOutput.slice();

    newInput.push(input);
    newOutput.push(output);

    updateExampleInput(newInput);
    updateExampleOutput(newOutput);

    onClose();
  };

  return (
    <Wrapper>
      <h4>입력</h4>
      <TestCaseArea onChange={handleEnterInput} />
      <h4>출력</h4>
      <TestCaseArea onChange={handleEnterOutput} />
      <Bottom>
        <AddButton onClick={handleAddTestCase}>추가</AddButton>
        <CancleButton onClick={onClose}>취소</CancleButton>
      </Bottom>
    </Wrapper>
  );
}

export default AdditionalTestCaseModal;
