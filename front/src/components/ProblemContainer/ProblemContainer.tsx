import { useEffect } from 'react';
import useFetchProblem from '@/hooks/useFetchProblem';
import useProblemStore from '@/store/store';
import Example from '@/components/Example';
import ProblemSection from '@/components/ProblemSection';
import Spinner from '@/components/Spinner';
import { ProblemH6, Wrapper } from './ProblemContainer.style';

interface ProblemContainerProps {
  width: number;
}

function ProblemContainer({ width }: ProblemContainerProps) {
  const problemNumber = useProblemStore((state) => state.problemNumber);

  const updateExampleInput = useProblemStore(
    (state) => state.updateExampleInput,
  );
  const updateExampleOutput = useProblemStore(
    (state) => state.updateExampleOutput,
  );
  const { data, error, setData } = useFetchProblem(problemNumber);

  useEffect(() => {
    if (data?.examples?.length !== undefined) {
      const exampleInput = data.examples.map(({ input }) => input);
      const exampleOutput = data.examples.map(({ output }) => output);

      updateExampleInput(exampleInput);
      updateExampleOutput(exampleOutput);
    }
  }, [data, updateExampleInput, updateExampleOutput]);

  useEffect(() => {
    setData(null);
  }, [problemNumber]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Wrapper style={{ width: `${width}%` }}>
      {data === null ? (
        <Spinner />
      ) : (
        <>
          <div>
            <h3>{data.title}</h3>
          </div>
          <ProblemSection title="문제설명" html={data.descriptionHtml} />
          <ProblemSection title="입력" html={data.inputHtml} />
          <ProblemSection title="출력" html={data.outputHtml} />
          {data.limitHtml !== null ? (
            <ProblemSection title="제한" html={data.limitHtml} />
          ) : null}
          {data.examples !== null
            ? data.examples.map(({ input, number, output }) => {
                return (
                  <div key={number}>
                    <ProblemH6>예제 입력 {number}</ProblemH6>
                    <Example content={input} />
                    <ProblemH6>예제 출력 {number}</ProblemH6>
                    <Example content={output} />
                  </div>
                );
              })
            : null}
        </>
      )}
    </Wrapper>
  );
}

export default ProblemContainer;
