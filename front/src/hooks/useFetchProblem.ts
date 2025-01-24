import { useState, useEffect } from 'react';
import { requestProblem } from '@/apis/problemApi';
import { AxiosError } from 'axios';

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
  setError: React.Dispatch<React.SetStateAction<Error | null>>;
} {
  const [data, setData] = useState<ProblemContent | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await requestProblem(pId);
        setData(response.data);
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          if(err.response?.status === 404) {
            setError(new Error('존재하지 않는 문제 번호입니다.'));
          } else {
            setError(new Error('서버에 문제가 발생했습니다.'));
          }
        }
      }
    }

    fetchData();
  }, [pId]);

  return { data, error, setData, setError };
}

export default useFetchProblem;
