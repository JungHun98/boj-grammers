import { useState, useCallback, useEffect, useRef, DragEventHandler, ChangeEventHandler } from "react";
import { useParams, useBlocker, useNavigate } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { copilot } from "@uiw/codemirror-theme-copilot";
import io from "socket.io-client";
import { LanguageName, loadLanguage } from "@uiw/codemirror-extensions-langs";

import { IOutput, IProblem } from "../types";
import { defaultCode } from "../utils/consts";

import styled from "@emotion/styled";

interface IDialog {
  title: string;
  text: string;
}

interface ProblemSectionProps {
  title: string;
  html: string;
}

interface ExampleProps {
  content: string;
}

function ProblemSection({title, html}: ProblemSectionProps) {
  return( 
  <div>
    <ProblemH6>{title}</ProblemH6>
    <div dangerouslySetInnerHTML={{ __html: html}}></div>
  </div>
  )
}

function Example({content}: ExampleProps) {
  return( 
  <div>
    <pre>{content}</pre>
  </div>
  )
}


const Problem = () => {
  const navigate = useNavigate();
  let blocker = useBlocker(true);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const codeRef = useRef<string>();

  const [leftWidth, setLeftWidth] = useState(40);
  const [upHeigth, setUpHeigth] = useState(40);
  
  const [lang, setLang] = useState<LanguageName>("javascript");
  const [result, setResult] = useState<IOutput[] | null>();
  const [output, setOutput] = useState<IOutput[] | null>();
  const [error, setError] = useState<string | null>();
  const [dialogText, setDialogText] = useState<IDialog | null>();

  const [problem, setProblem] = useState({title:'', descriptionHtml:'', inputHtml: '',
    outputHtml: '',
    limitHtml: '',
    examples: [{
      explain: '',
      input: '',
      number: 0,
      output: '' 
    }]});
  const [problemNumber, setProblemNumber] = useState(1000);

  async function ft () {
    const result = await fetch(`http://localhost:8080/api/problem?problemId=${problemNumber}`).then((response) => response.json());
    setProblem(result);
  }
  

  const handleDrag: DragEventHandler= (e) => {
    const newLeftWidth = (e.clientX / window.innerWidth) * 100;
    if (newLeftWidth > 5 && newLeftWidth < 95) { // 최소, 최대 너비 설정
      setLeftWidth(newLeftWidth);
    }
  };

  const handleVirticalDrag: DragEventHandler= (e) => {
    const newUpHegith = (e.clientY / window.innerHeight) * 100;
    if (newUpHegith > 5 && newUpHegith < 95) { // 최소, 최대 너비 설정
      setUpHeigth(newUpHegith);
    }
  };

  const handleProblemInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    const inputElement = e.target;
    setProblemNumber(Number(inputElement.value));
  }

  const handleSearchProblem = () => {
    ft();
  }

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
    setOutput(null);
    setError(null);
    switch (lang) {
      case "javascript":
        codeRef.current = defaultCode.javscript;
        break;
      case "python":
        codeRef.current = defaultCode.python;
        break;
      case "java":
        codeRef.current = defaultCode.java;
        break;
      case "cpp":
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
    if (blocker.state === "blocked") {
      const isTrue = window.confirm("변경사항이 저장되지 않을 수 있습니다.");

      if (isTrue) {
        blocker.proceed();
        navigate("/");
      } else {
        blocker.reset();
      }
    }
  }, [blocker, navigate]);

  return (
    <>
      <div className="wrapper">
        <div className="header">
          <div className="title">
            <ProblemNumberInput onChange={handleProblemInput}/>
            <ProblemSearchButton onClick={handleSearchProblem}>
              <img src='/search.svg' alt='' width={24}/>
            </ProblemSearchButton>
          </div>
          <div className="select-lang">
            <select
              onChange={(e) => setLang(e.target.value as LanguageName)}
              defaultValue="Javascript"
            >
              <option>javascript</option>
              <option>python</option>
              <option>java</option>
              <option>cpp</option>
            </select>
          </div>
        </div>
        <main>
          <div className="problem" style={{ width: `${leftWidth}%` }}>  
            <div>
              <h3>{problem.title}</h3>
            </div>
            <ProblemSection title="문제설명" html={problem.descriptionHtml}/>
            <ProblemSection title="입력" html={problem.inputHtml}/>
            <ProblemSection title="출력" html={problem.outputHtml}/>
            {problem.limitHtml !== null ? <ProblemSection title="제한" html={problem.limitHtml}/> : null}

            {problem.examples!== null ? problem.examples.map(({explain, input, number, output}) => {
              return (
              <div key={number}>
                <ProblemH6>예제 입력 {number}</ProblemH6>
                <Example content={input}/>
                <ProblemH6>예제 출력 {number}</ProblemH6>
                <Example content={output}/>
              </div>
              )
            }) : null}
          </div>
          <div className="gutter" draggable="true" onDrag={handleDrag}></div>
          <div className="code-wrapper" style={{ width: `${100 - leftWidth}%` }}>
            <div className="solution-wrapper">
              <div className="codeMirror-wrapper" style={{ height: `${upHeigth}%` }}>
                <CodeMirror
                  value={codeRef.current}
                  onChange={(e) => {
                    codeRef.current = e;
                  }}
                  theme={copilot}
                  height="100%"
                  extensions={[loadLanguage(`${lang}`)!]}
                  />
              </div>

                <div className="gutter_vertical" draggable="true" onDrag={handleVirticalDrag}></div>

              <div className="output" style={{ height: `${100 - upHeigth}%` }}>
                {error ? (
                  <p
                    style={{
                      margin: "0px",
                      color: "#c92c2c",
                      whiteSpace: "pre-wrap",
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
                          const input = v.input?.includes("\\n")
                            ? v.input.split("\\n").join("\n")
                            : v.input;
                          const output =
                            typeof v.output === "string" && v.output.includes("\\n")
                              ? v.output.split("\\n").join("\n")
                              : v.output;
                          const result =
                            typeof v.result === "string" && v.result.includes("\\n")
                              ? v.result.split("\\n").join("\n")
                              : v.result;

                          return (
                            <table className="code-output" key={i}>
                              <tbody>
                                <tr>
                                  <th>입력값</th>
                                  <td style={{ whiteSpace: "pre-line" }}>
                                    {input ?? "로딩중..."}
                                  </td>
                                </tr>
                                <tr>
                                  <th>기댓값</th>
                                  <td style={{ whiteSpace: "pre-line" }}>
                                    {output ?? "로딩중..."}
                                  </td>
                                </tr>
                                <tr>
                                  <th>출력</th>
                                  <td style={{ whiteSpace: "pre-line" }}>
                                    {result ?? "로딩중..."}
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
                        <ul className="result-list">
                          
                        </ul>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="submit">
              {/* <button type="button" onClick={onClickCodeRun}>
                코드 실행
              </button> */}
              {/* <button type="button" onClick={onSubmit}>
                제출하기
              </button> */}
            </div>
          </div>
        
        </main>
      </div>
      <dialog ref={dialogRef}>
        <div className="dialog-content">
          <div className="inner">
            <h4>{dialogText?.title}</h4>
            <p>{dialogText?.text}</p>
            <form method="dialog">
              <button>닫기</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default Problem;

const ProblemNumberInput = styled('input')`
  padding: 0px 1.5rem 0px 1.0625rem;
  width: 10rem;
  height: 1.7rem;
  background-color: #151f29;
  border: 0.05rem solid #d5d5d5;
  border-radius: 0.25rem;
  appearance: none;
  color: white;
  caret-color: white;

  &:hover, &:focus-within {
    outline: none;
    border: 0.05rem solid rgb(0, 120, 255);
    box-shadow: rgb(0, 120, 255) 0px 0
  }
`

const ProblemSearchButton = styled('button')`
  position: absolute;
  right: 0;
  top: 2px;
  width: 24px;
  height: 24px;
  background-color: transparent;
  cursor: pointer;
`

const ProblemH6 = styled('h6')`
font-weight: 700;
font-size: 14px;
    margin-bottom: 1rem;
    color: white;
`