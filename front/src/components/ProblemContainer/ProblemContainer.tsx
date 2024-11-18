import useFetchProblem from '../../hooks/useFetchProblem';
import Example from '../Example';
import ProblemSection from '../ProblemSection';
import { ProblemH6, Wrapper } from './ProblemContainer.style';

interface ProblemContainerProps {
  width: number;
  problemId: number;
}

function ProblemContainer({ width, problemId }: ProblemContainerProps) {
  const { data, error } = useFetchProblem(problemId);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>Loading...</div>; // 데이터를 아직 불러오지 못한 상태
  }

  return (
    <Wrapper style={{ width: `${width}%` }}>
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
        ? data.examples.map(({ explain, input, number, output }) => {
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
    </Wrapper>
  );
}

export default ProblemContainer;
