import { ChangeEventHandler, useState } from 'react';
import {
  ProblemNumberInput,
  ProblemSearchButton,
  Wrapper,
} from './ProblemSearch.style';
import useProblemStore from '../../store/store';

function ProblemSearch() {
  const [problemNumber, setProblemNumber] = useState(1000);
  const updateProblemNumber = useProblemStore(
    (state) => state.updateProblemNumber,
  );

  const placeholderText = '백준 문제 번호를 입력해주세요.';

  const handleInputProblem: ChangeEventHandler<HTMLInputElement> = ({
    target,
  }) => {
    setProblemNumber(Number(target.value));
  };

  const handleSearchProblem = () => {
    updateProblemNumber(problemNumber);
  };

  return (
    <Wrapper>
      <ProblemNumberInput
        placeholder={placeholderText}
        onChange={handleInputProblem}
      />
      <ProblemSearchButton onClick={handleSearchProblem}>
        <img src="/search.svg" alt="검색" width={24} />
      </ProblemSearchButton>
    </Wrapper>
  );
}

export default ProblemSearch;
