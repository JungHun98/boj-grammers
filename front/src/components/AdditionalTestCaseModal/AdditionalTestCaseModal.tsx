import {
  AddButton,
  Bottom,
  CancleButton,
  TestCaseArea,
  Wrapper,
} from './AdditionalTestCaseModal.style';

interface AdditionalTestCaseModalProps {
  onClose: () => void;
}

function AdditionalTestCaseModal({ onClose }: AdditionalTestCaseModalProps) {
  return (
    <Wrapper>
      <h4>입력</h4>
      <TestCaseArea />
      <h4>출력</h4>
      <TestCaseArea />
      <Bottom>
        <AddButton>추가</AddButton>
        <CancleButton onClick={onClose}>취소</CancleButton>
      </Bottom>
    </Wrapper>
  );
}

export default AdditionalTestCaseModal;
