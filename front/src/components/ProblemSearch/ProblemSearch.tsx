import { ChangeEventHandler, FormEventHandler, useState } from 'react';
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

  const handleClickSearch = () => {
    updateProblemNumber(problemNumber);
  };

  const handleSubmitSearch: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    updateProblemNumber(problemNumber);
  };

  return (
    <Wrapper>
      <form onSubmit={handleSubmitSearch}>
        <ProblemNumberInput
          placeholder={placeholderText}
          onChange={handleInputProblem}
        />
        <ProblemSearchButton onClick={handleClickSearch}>
          <img src="/search.svg" alt="검색" width={24} />
        </ProblemSearchButton>
      </form>
    </Wrapper>
  );
}

export default ProblemSearch;
