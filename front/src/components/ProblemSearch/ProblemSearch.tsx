import { ChangeEventHandler, useState } from 'react';
import {
  ProblemNumberInput,
  ProblemSearchButton,
  Wrapper,
} from './ProblemSearch.style';

function ProblemSearch() {
  const [problemNumber, setProblemNumber] = useState(1000);
  const placeholderText = '백준 문제 번호를 입력해주세요.';

  const handleInputProblem: ChangeEventHandler<HTMLInputElement> = ({
    target,
  }) => {
    setProblemNumber(Number(target.value));
  };

  const handleSearchProblem = () => {};

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
