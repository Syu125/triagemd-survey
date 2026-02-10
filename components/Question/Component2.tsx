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

const questions = [
  "Is the patient's response relevant to the patient’s preceding message?",
  "Does the patient provide some kind of yes or no answer?",
  "Does the patient answer affirmatively ('Yes') or negatively ('No')?",
  "Does the patient express uncertainty (e.g., with 'maybe', 'not sure', 'probably')?",
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
    // Initialize state with "Yes" defaults
    const [responses, setResponses] = useState<
      Record<number, Record<number, string>>
    >(() => {
      const initial: Record<number, Record<number, string>> = {};
      snippets.forEach((_, dialogIndex) => {
        initial[dialogIndex] = {};
        questions.forEach((_, qIdx) => {
          initial[dialogIndex][qIdx] = "Yes";
        });
      });
      return initial;
    });

    useEffect(() => {
      if (savedResponse) {
        // Split the saved string into lines
        const lines = savedResponse.split("\n").filter((l) => l.trim() !== "");

        // If the string is empty or invalid, don't overwrite defaults
        if (lines.length === 0) return;

        setResponses((prev) => {
          const next = { ...prev };

          // Logic: The string stores answers sequentially.
          // 3 snippets * 4 questions = 12 lines.
          // Line i corresponds to Snippet [Math.floor(i/4)] Question [i%4]
          let lineIndex = 0;

          snippets.forEach((_, sIdx) => {
            // Ensure the snippet object exists
            if (!next[sIdx]) next[sIdx] = {};

            questions.forEach((_, qIdx) => {
              const line = lines[lineIndex];
              if (line) {
                // Check if the line ends with "No" (case insensitive check usually safer, but strict here matches your save)
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
      console.log("Toggle response received:", dialogIndex, index, isYes);

      setResponses((prev) => {
        const copy = { ...prev };
        // Update the specific toggle in local state
        copy[dialogIndex] = {
          ...copy[dialogIndex],
          [index]: isYes ? "Yes" : "No",
        };
        const fullString = snippets
          .map((_, sIdx) => {
            return questions
              .map((q, qIdx) => {
                // Get the answer from state, defaulting to Yes if somehow missing
                const ans = copy[sIdx]?.[qIdx] || "Yes";
                return `${ans}`;
              })
              .join("\n");
          })
          .join("\n");

        console.log("Updated responses obj:", copy);
        console.log("Full Combined String:", fullString);

        // Send the complete string to parent
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
            gap: "72px",
          }}
        >
          {snippets.map((snippet, index) => {
            const dialogs = formatSnippet(snippet);

            return (
              <div className="w-8/12 place-self-center" key={index}>
                <div
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                  }}
                >
                  {" "}
                  <span>
                    {previousProtocols[index] ? (
                      "Protocol: "
                    ) : (
                      <>
                        TriageMD's chosen flowchart:{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {flowchartName}
                        </span>
                      </>
                    )}
                  </span>
                  {previousProtocols[index] ? previousProtocols[index] : ""}
                </div>
                <div
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    backgroundColor: "var(--color-green4)",
                    borderLeft: `4px solid var(--color-green1)`,
                  }}
                >
                  <span style={{ fontWeight: "bold" }}>{"Patient:"}</span>
                  <span>{dialogs[0]?.split("Patient:")[1] || ""}</span>
                </div>
                <div className="flex flex-col gap-8 pt-8">
                  {questions.map((question, idx) => (
                    <div className="flex flex-row items-center gap-8" key={idx}>
                      <ToggleSwitch
                        dialogIndex={index}
                        index={idx}
                        // Reads from the now-synchronized state
                        isEnabled={responses[index]?.[idx] === "Yes"}
                        onToggle={saveToggleResponse}
                      />
                      <p>{question}</p>
                    </div>
                  ))}
                </div>
                {/* <div
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    backgroundColor: "var(--color-teal4)",
                    borderLeft: `4px solid var(--color-teal1)`,
                  }}
                >
                  <span>{"[Protocol: " + nextProtocols[index] + "]"}</span>
                  <div></div>
                  <span style={{ fontWeight: "bold" }}>{"TriageMD:"}</span>
                  <span>{dialogs[1]?.split("TriageMD:")[1] || ""}</span>
                </div>

                <div className="flex flex-col gap-8 pt-8">
                  {questions.map((question, idx) => (
                    <div className="flex flex-row items-center gap-8" key={idx}>
                      <ToggleSwitch
                        dialogIndex={index}
                        index={idx}
                        // Reads from the now-synchronized state
                        isEnabled={responses[index]?.[idx] === "Yes"}
                        onToggle={saveToggleResponse}
                      />
                      <p>{question}</p>
                    </div>
                  ))}
                </div> */}
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);
export default Component2;
