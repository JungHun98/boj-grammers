import { useState, useCallback, useEffect, useRef, DragEventHandler } from "react";
import { useParams, useBlocker, useNavigate } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { copilot } from "@uiw/codemirror-theme-copilot";
import io from "socket.io-client";
import { LanguageName, loadLanguage } from "@uiw/codemirror-extensions-langs";

import { IOutput, IProblem } from "../types";
import { defaultCode } from "../utils/consts";

interface IDialog {
  title: string;
  text: string;
}

const Problem = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();
  let blocker = useBlocker(true);

  // const socket = io(`${process.env.REACT_APP_API_ENDPOINT}/problem`, {
  //   transports: ["websocket", "polling"],
  //   query: {
  //     problem: problemId,
  //     path: "*",
  //   },
  // });

  const dialogRef = useRef<HTMLDialogElement>(null);
  const codeRef = useRef<string>();

  const [leftWidth, setLeftWidth] = useState(40);
  const [upHeigth, setUpHeigth] = useState(40);
  
  const [lang, setLang] = useState<LanguageName>("javascript");
  const [result, setResult] = useState<IOutput[] | null>();
  const [output, setOutput] = useState<IOutput[] | null>();
  const [error, setError] = useState<string | null>();
  const [dialogText, setDialogText] = useState<IDialog | null>();

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
    if (problemId) {
      // requestProblem(problemId).then((rep) => setProblem(rep.data));
    }
  }, [problemId]);

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
            문제 검색
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
            <div className="question">
              문제
            </div>
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
