import { ChangeEventHandler, FormEventHandler, useState } from 'react';
import {
  ProblemNumberInput,
  ProblemSearchButton,
  Wrapper,
} from './ProblemSearch.style';
import useProblemStore from '@/store/store';

function ProblemSearch() {
  const [problemNumber, setProblemNumber] = useState<string>();

  const updateProblemNumber = useProblemStore(
    (state) => state.updateProblemNumber,
  );

  const placeholderText = '백준 문제 번호를 입력해주세요.';

  const handleInputProblem: ChangeEventHandler<HTMLInputElement> = ({
    target,
  }) => {
    setProblemNumber(target.value);
  };

  const handleSearch = () => {
    const inputValue = Number(problemNumber);

    if(isNaN(inputValue)) {
      alert('문제 번호에 숫자만 입력해주세요.');
      return;
    }

    updateProblemNumber(inputValue);
  }

  const handleSubmitSearch: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <Wrapper>
      <form onSubmit={handleSubmitSearch}>
        <ProblemNumberInput
          placeholder={placeholderText}
          onChange={handleInputProblem}
        />
        <ProblemSearchButton type='submit'>
          <img src="/search.svg" alt="검색" width={24} />
        </ProblemSearchButton>
      </form>
    </Wrapper>
  );
}

export default ProblemSearch;
