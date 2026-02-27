import { useState, useEffect, forwardRef } from "react";
import ToggleSwitch from "../Toggle/toggle";

interface Component2Props {
  flowchartName: string;
  snippets: string[];
  previousProtocols: string[];
  nextProtocols: string[];
  onResponse: (value: string) => void;
  savedResponse?: string;
}

const formatSnippet = (snippet: string): string[] => {
  return snippet.split(/(?=Patient:|TriageMD:)/).filter(Boolean);
};

const questionSets = [
  [
    "Does the patient’s chief complaint mention or describe the symptom asked about in the question?",
    "Based on the patient’s chief complaint, is there enough information to determine whether the answer to the question is yes or no?",
    "If there is enough information, what is the answer to the question? (Select 'No' if there is not enough information)",
    "Does the patient express doubt or uncertainty about this symptom?",
  ],
  [
    "Does the patient’s response directly address the specific symptom or condition asked about by TriageMD?",
    "Does the patient’s response provide enough information to establish a clear 'Yes' or 'No' intent?",
    "Based on the patient's response, what is the answer to the question?",
    "Is the patient's answer ambiguous or uncertain (i.e., they do not provide a definitive 'Yes' or 'No')?",
  ],
  [
    "Does the patient’s response directly address the specific symptom or condition asked about by TriageMD?",
    "Does the patient’s response provide enough information to establish a clear 'Yes' or 'No' intent?",
    "Based on the patient's response, what is the answer to the question?",
    "Is the patient's answer ambiguous or uncertain (i.e., they do not provide a definitive 'Yes' or 'No')?",
  ],
];

// Define your different labels here
const snippetLabels = [
  "First question from the flowchart (used to determine the first question TriageMD asks the patient)",
  "Randomly selected question from the conversation",
  "Randomly selected question from the conversation",
];

const speakerLabels = [
  "Patient's Chief Complaint",
  "Patient's Response",
  "Patient's Response",
];
const Component2 = forwardRef<HTMLDivElement, Component2Props>(
  (
    {
      flowchartName,
      snippets,
      previousProtocols,
      nextProtocols,
      onResponse,
      savedResponse,
    },
    ref,
  ) => {
    const [responses, setResponses] = useState<
      Record<number, Record<number, string>>
    >(() => {
      const initial: Record<number, Record<number, string>> = {};

      if (savedResponse) {
        const lines = savedResponse.split("\n").filter((l) => l.trim() !== "");
        let lineIndex = 0;
        snippets.forEach((_, sIdx) => {
          initial[sIdx] = {};
          const currentQuestions = questionSets[sIdx] || [questionSets[0]];
          currentQuestions.forEach((_, qIdx) => {
            initial[sIdx][qIdx] = lines[lineIndex] === "No" ? "No" : "Yes";
            lineIndex++;
          });
        });
        return initial;
      }

      snippets.forEach((_, dialogIndex) => {
        initial[dialogIndex] = {};
        const currentQuestions = questionSets[dialogIndex] || [questionSets[0]];
        currentQuestions.forEach((_, qIdx) => {
          initial[dialogIndex][qIdx] = "Yes";
        });
      });
      return initial;
    });

    useEffect(() => {
      if (savedResponse) {
        const lines = savedResponse.split("\n").filter((l) => l.trim() !== "");
        if (lines.length === 0) return;

        setResponses((prev) => {
          const next = { ...prev };
          let lineIndex = 0;
          snippets.forEach((_, sIdx) => {
            if (!next[sIdx]) next[sIdx] = {};
            const currentQuestions = questionSets[sIdx] || [questionSets[0]];
            currentQuestions.forEach((_, qIdx) => {
              const line = lines[lineIndex];
              if (line) {
                const isNo = line.trim().endsWith("No");
                next[sIdx][qIdx] = isNo ? "No" : "Yes";
              }
              lineIndex++;
            });
          });
          return next;
        });
      }
    }, [savedResponse, snippets]);

    const saveToggleResponse = (
      dialogIndex: number,
      index: number,
      isYes: boolean,
    ) => {
      setResponses((prev) => {
        const copy = { ...prev };
        copy[dialogIndex] = {
          ...copy[dialogIndex],
          [index]: isYes ? "Yes" : "No",
        };
        const fullString = snippets
          .map((_, sIdx) => {
            const currentQuestions = questionSets[sIdx] || [questionSets[0]];
            return currentQuestions
              .map((q, qIdx) => {
                const ans = copy[sIdx]?.[qIdx] || "Yes";
                return `${ans}`;
              })
              .join("\n");
          })
          .join("\n");

        onResponse(fullString);
        return copy;
      });
    };

    return (
      <div ref={ref} style={{ scrollMarginTop: "100px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "48px",
          }}
        >
          <span
            className="w-4/12 place-self-center text-center"
            style={{
              marginTop: "24px",
              color: "var(--color-green5)",
              padding: "12px",
              borderRadius: "8px",
              fontSize: "20px",
            }}
          >
            TriageMD's chosen flowchart:
            <div style={{ fontWeight: "bold" }}>{flowchartName}</div>
          </span>

          {snippets.map((snippet, index) => {
            const dialogs = formatSnippet(snippet);
            const currentQuestions = questionSets[index] || [questionSets[0]];

            return (
              <div className="w-8/12 place-self-center" key={index}>
                {/* Updated Label Section */}
                <div
                  style={{
                    padding: "8px 12px",
                    marginBottom: "8px",
                    fontSize: "0.9rem",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <span style={{ fontWeight: "600", color: "#666" }}>
                    {snippetLabels[index] || `Section ${index + 1}`}:
                  </span>
                  <div></div>
                  <span
                    style={{
                      color: "#666",
                    }}
                  >
                    {previousProtocols[index]}
                  </span>
                </div>

                <div
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    backgroundColor: "var(--color-green4)",
                    borderLeft: `4px solid var(--color-green1)`,
                  }}
                >
                  <span style={{ fontWeight: "bold" }}>
                    {speakerLabels[index] || "Patient"}:
                  </span>
                  <span>{dialogs[0]?.split("Patient:")[1] || ""}</span>
                </div>

                <div className="flex flex-col gap-8 pt-8">
                  {currentQuestions.map((question, qIdx) => (
                    <div
                      className="flex flex-row items-center gap-8"
                      key={qIdx}
                    >
                      <ToggleSwitch
                        dialogIndex={index}
                        index={qIdx}
                        isEnabled={responses[index]?.[qIdx] === "Yes"}
                        onToggle={saveToggleResponse}
                      />
                      <p>{question}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);

export default Component2;
