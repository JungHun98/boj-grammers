import { useState, useEffect, useRef, DragEventHandler } from 'react';
import { useBlocker, useNavigate } from 'react-router-dom';

import io from 'socket.io-client';
import { LanguageName } from '@uiw/codemirror-extensions-langs';

import { IOutput, IProblem } from '../types';
import { defaultCode } from '../utils/consts';

import ProblemSearch from '../components/ProblemSearch';
import ProblemContainer from '../components/ProblemContainer';
import styled from '@emotion/styled';
import CodeSpace from '../components/CodeSpace';
import LangSelect from '../components/LangSelect';

interface IDialog {
  title: string;
  text: string;
}

interface ProblemProps {
  onOpen: () => void;
}

const Problem = ({ onOpen }: ProblemProps) => {
  const navigate = useNavigate();
  let blocker = useBlocker(true);

  const codeRef = useRef<string>();

  const [leftWidth, setLeftWidth] = useState(40);
  const [upHeigth, setUpHeigth] = useState(60);

  const [lang, setLang] = useState<LanguageName>('javascript');
  const [result, setResult] = useState<IOutput[] | null>();
  const [output, setOutput] = useState<IOutput[] | null>();
  const [error, setError] = useState<string | null>();

  const handleDrag: DragEventHandler = (e) => {
    const newLeftWidth = (e.clientX / window.innerWidth) * 100;
    if (newLeftWidth > 5 && newLeftWidth < 95) {
      // 최소, 최대 너비 설정
      setLeftWidth(newLeftWidth);
    }
  };

  const handleVirticalDrag: DragEventHandler = (e) => {
    const newUpHegith = (e.clientY / window.innerHeight) * 100;
    if (newUpHegith > 5 && newUpHegith < 95) {
      // 최소, 최대 너비 설정
      setUpHeigth(newUpHegith);
    }
  };

  // const onSubmit = useCallback(() => {
  //   setResult(null);
  //   setOutput(null);
  //   setError(null);
  //   socket.emit("submit", {
  //     room: problemId,
  //     id: problemId,
  //     code: codeRef.current,
  //     lang,
  //   });
  // }, [lang, problemId, socket]);

  // const onClickCodeRun = useCallback(() => {
  //   setResult(null);
  //   setOutput(null);
  //   setError(null);
  //   socket.emit("codeRun", {
  //     room: problemId,
  //     id: problemId,
  //     code: codeRef.current,
  //     lang,
  //   });
  // }, [lang, problemId, socket]);

  useEffect(() => {
    setResult(null);
    setOutput([{ index: 0, input: '1', output: '2', result: '정답' }]);
    setError(null);
    switch (lang) {
      case 'javascript':
        codeRef.current = defaultCode.javascript;
        break;
      case 'python':
        codeRef.current = defaultCode.python;
        break;
      case 'java':
        codeRef.current = defaultCode.java;
        break;
      case 'cpp':
        codeRef.current = defaultCode.cpp;
        break;
      default:
        break;
    }
  }, [lang]);

  // useEffect(() => {
  // socket.on("test", (data) => {
  //   setResult(data);
  //   if (data.every((v: IOutput) => v.output !== null)) {
  //     setTimeout(() => {
  //       data.some((v: IOutput) =>
  //         !v.output
  //           ? setDialogText({
  //               title: "실패",
  //               text: "아쉽게도 테스트에 통과하지 못 했습니다.",
  //             })
  //           : setDialogText({
  //               title: "성공",
  //               text: "모든 테스트를 통과헸습니다. 축하드립니다!",
  //             })
  //       );
  //       dialogRef.current?.showModal();
  //     }, 500);
  //   }
  // });
  // socket.on("output", (data) => {
  //   setOutput(data);
  // });
  // socket.on("error", (data) => {
  //   setError(data);
  // });
  // }, [socket]);

  // useEffect(() => {
  //   const onBeforeUnload = (e: { preventDefault: () => void }) => {
  //     e.preventDefault();
  //   };

  //   window.addEventListener("beforeunload", onBeforeUnload);
  //   return () => {
  //     window.removeEventListener("beforeunload", onBeforeUnload);
  //   };
  // }, [socket]);

  useEffect(() => {
    if (blocker.state === 'blocked') {
      const isTrue = window.confirm('변경사항이 저장되지 않을 수 있습니다.');

      if (isTrue) {
        blocker.proceed();
        navigate('/');
      } else {
        blocker.reset();
      }
    }
  }, [blocker, navigate]);

  return (
    <div className="wrapper">
      <div className="header">
        <ProblemSearch />
        <LangSelect />
      </div>
      <main>
        <ProblemContainer width={leftWidth} />
        <div className="gutter" draggable="true" onDrag={handleDrag} />
        <div className="code-wrapper" style={{ width: `${100 - leftWidth}%` }}>
          <div className="solution-wrapper">
            <CodeSpace height={upHeigth} />
            <div
              className="gutter_vertical"
              draggable="true"
              onDrag={handleVirticalDrag}
            ></div>

            <div className="output" style={{ height: `${100 - upHeigth}%` }}>
              {error !== null ? (
                <p
                  style={{
                    margin: '0px',
                    color: '#c92c2c',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {error}
                </p>
              ) : (
                <>
                  {output && (
                    <>
                      <h3>실행 결과</h3>
                      {output.map((v, i) => {
                        const input = v.input?.includes('\\n')
                          ? v.input.split('\\n').join('\n')
                          : v.input;
                        const output =
                          typeof v.output === 'string' &&
                          v.output.includes('\\n')
                            ? v.output.split('\\n').join('\n')
                            : v.output;
                        const result =
                          typeof v.result === 'string' &&
                          v.result.includes('\\n')
                            ? v.result.split('\\n').join('\n')
                            : v.result;

                        return (
                          <table className="code-output" key={i}>
                            <tbody>
                              <tr>
                                <th>입력값</th>
                                <td style={{ whiteSpace: 'pre-line' }}>
                                  {input ?? '로딩중...'}
                                </td>
                              </tr>
                              <tr>
                                <th>기댓값</th>
                                <td style={{ whiteSpace: 'pre-line' }}>
                                  {output ?? '로딩중...'}
                                </td>
                              </tr>
                              <tr>
                                <th>출력</th>
                                <td style={{ whiteSpace: 'pre-line' }}>
                                  {result ?? '로딩중...'}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        );
                      })}
                    </>
                  )}
                  {result && (
                    <>
                      <h3>체점 결과</h3>
                      <ul className="result-list"></ul>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="submit">
            <div>
              <Button onClick={onOpen}>테스트 케이스 추가하기</Button>
            </div>
            <div>
              <Button>코드 실행</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Problem;

const Button = styled('button')`
  margin: 0;
  padding: 0.4375rem 0.8125rem;
  font-size: 1rem;
  line-height: 1.5rem;
  background-color: #44576c;
  color: white;
  cursor: pointer;
  border-radius: 0.25rem;

  &: hover {
    border-color: #37485d;
    background-color: #37485d;
  }
`;
