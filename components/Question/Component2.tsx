import { useState, useEffect, forwardRef } from "react";
import ToggleSwitch from "../Toggle/toggle";

interface Component2Props {
  snippets: string[];
  onResponse: (value: string) => void;
  savedResponse?: string;
}

const formatSnippet = (snippet: string): string[] => {
  return snippet.split(/(?=Patient:|TriageMD:)/).filter(Boolean);
};

const questions = [
  "Is TriageMD’s response relevant to the patient’s preceding message?",
  "Does TriageMD converge on and clearly communicate a triage recommendation in this snippet?",
  "Does TriageMD’s response align with the provided AMA triage flowchart?",
  "Does TriageMD appropriately address uncertainty given the available information?",
];

const Component2 = forwardRef<HTMLDivElement, Component2Props>(
  ({ snippets, onResponse, savedResponse }, ref) => {
    const [value, setValue] = useState("");

    useEffect(() => {
      if (savedResponse) {
        setValue(savedResponse);
      } else {
        setValue("");
      }
    }, [snippets, savedResponse]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
      onResponse(e.target.value);
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
            const isPatient = snippet.startsWith("Patient:");
            const dialogs = formatSnippet(snippet);

            return (
              <div className="w-8/12 place-self-center" key={index}>
                <div
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    backgroundColor: "#f0f7ff",
                    borderLeft: `4px solid ${"#007bff"}`,
                  }}
                >
                  <span style={{ fontWeight: "bold" }}>{"Patient:"}</span>
                  <span>{dialogs[0].split("Patient:")[1]}</span>
                </div>
                <div
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9",
                    borderLeft: `4px solid ${"#28a745"}`,
                  }}
                >
                  <span style={{ fontWeight: "bold" }}>{"TriageMD:"}</span>
                  <span>{dialogs[1].split("TriageMD:")[1]}</span>
                </div>

                <div className="flex flex-col gap-8 pt-8">
                  {questions.map((question, idx) => (
                    <div className="flex flex-row items-center gap-8">
                      <ToggleSwitch />
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
