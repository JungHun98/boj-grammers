import { useState, useEffect } from 'react';
import { requestProblem } from '@/apis/problemApi';

interface ExampleInputOutput {
  explain: string;
  input: string;
  number: number;
  output: string;
}

interface ProblemContent {
  title: string;
  descriptionHtml: string;
  inputHtml: string;
  outputHtml: string;
  limitHtml: string;
  examples: ExampleInputOutput[];
}

function useFetchProblem(pId: number): {
  data: ProblemContent | null;
  error: Error | null;
  setData: React.Dispatch<React.SetStateAction<ProblemContent | null>>;
} {
  const [data, setData] = useState<ProblemContent | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await requestProblem(pId);
        console.log(response);
        setData(response.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error('유효한 문제 번호가 아닙니다.'));
        }
      }
    }

    fetchData();
  }, [pId]);

  return { data, error, setData };
}

export default useFetchProblem;
