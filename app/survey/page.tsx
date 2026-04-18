"use client";
import { useState, useEffect } from "react";
import Component1 from "@/components/Question/Component1";
import Component2 from "@/components/Question/Component2";
import { useCode } from "@/context/CodeContext";
import { CODE_TO_VERSION, FLOWCHART_GROUPS } from "@/constants";
import { loadSurveyData, SurveyItem } from "@/lib/surveyDataLoader";
import { useRef } from "react";
import { saveSurvey } from "./actions";

const getSaved = (key: string, fallback: any) => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  }
  return fallback;
};

const clampIndex = (index: number, length: number) => {
  if (!Number.isFinite(index)) return 0;
  if (length <= 0) return 0;
  return Math.max(0, Math.min(index, length - 1));
};

export default function Survey() {
  const { code } = useCode();
  const [surveyItems, setSurveyItems] = useState<SurveyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(() =>
    getSaved("currentIndex", 0),
  );
  const initialYes = Array(12).fill("Yes").join("\n");
  const [responses, setResponses] = useState<{
    [key: number]: { component1?: string; component2?: string };
  }>(() => getSaved("responses", { 0: { component2: initialYes } }));
  const component2Ref = useRef<HTMLDivElement>(null);

  // Survey storage
  const [surveyState, setSurveyState] = useState<SurveyState>(() =>
    getSaved("surveyState", {
      code: code || "",
      surveyId: 1,
      topics: Array.from({ length: 10 }, () => ({
        component1: null,
        component2: [],
      })),
    }),
  );

  const [currentTopic, setCurrentTopic] = useState(() =>
    getSaved("currentTopic", 0),
  );

  // For Component 1
  const [patientSymptoms, setPatientSymptoms] = useState<string[]>([]);
  interface PatientDemographics {
    id: number;
    sex: string;
    age: string;
    options: string[];
    flowchart: string;
  }
  const [patientDemographics, setPatientDemographics] = useState<
    PatientDemographics[]
  >([]);

  // For Component 2

  const getFlowchartOptions = (flowchartName: string): string[] => {
    for (const [groupName, flowcharts] of Object.entries(FLOWCHART_GROUPS)) {
      if (flowcharts.includes(flowchartName)) {
        return [...flowcharts, "None of the above"];
      }
    }
    return [];
  };
  const handleSubmit = () => {
    setTimeout(() => {
      component2Ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  };

  useEffect(() => {
    console.log("loading survey state from localStorage");
    const savedState = localStorage.getItem("surveyState");
    if (savedState) {
      setSurveyState(JSON.parse(savedState));
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const versionIndex = CODE_TO_VERSION[code.toUpperCase()];
        // console.log("Version Index:", versionIndex); // Debugging line
        if (!versionIndex) {
          setError("Invalid code");
          return;
        }

        console.log("Version INdex: ", versionIndex);
        const data = await loadSurveyData(versionIndex);

        console.log("Loaded survey data:", data[0].flowchart); // Debugging line
        setSurveyItems(data);

        const symptomsList: string[] = [];
        const demographics: PatientDemographics[] = [];
        for (let i = 0; i < 10; i++) {
          const entry = data[i * 3];
          // console.log("Processing entry:", entry); // Debugging line
          // const patientMatch = entry.dialog.match(
          //   /Patient:\s*(.+?)(?=\nTriageMD:|$)/,
          // );
          // symptomsList.push(patientMatch ? patientMatch[1].trim() : "");
          symptomsList.push(entry.dialog.split("\n")[0].replace("Patient:", "").trim());
          demographics.push({
            id: entry.id,
            sex: entry.sex,
            age: entry.age,
            options: getFlowchartOptions(entry.flowchart),
            flowchart: entry.flowchart,
          });
        }

        console.log("Demographics: ", demographics);
        console.log("Symptoms: ", symptomsList);
        setPatientSymptoms(symptomsList);
        setPatientDemographics(demographics);
      } catch (err) {
        setError(
          `Failed to load survey data: ${
            err instanceof Error ? err.message : "Unknown error"
          }`,
        );
      } finally {
        setLoading(false);
      }
    };

    if (code) {
      loadData();
    }
  }, [code]);

  useEffect(() => {
    console.log(
      "Saving survey state to localStorage:",
      JSON.stringify(surveyState),
    );
    localStorage.setItem("surveyState", JSON.stringify(surveyState));
  }, [surveyState]);

  useEffect(() => {
    localStorage.setItem("responses", JSON.stringify(responses));
  }, [responses]);

  useEffect(() => {
    localStorage.setItem("currentIndex", JSON.stringify(currentIndex));
  }, [currentIndex]);

  useEffect(() => {
    localStorage.setItem("currentTopic", JSON.stringify(currentTopic));
  }, [currentTopic]);

  useEffect(() => {
    if (patientSymptoms.length === 0) return;

    const boundedIndex = clampIndex(currentIndex, patientSymptoms.length);
    if (boundedIndex !== currentIndex) {
      setCurrentIndex(boundedIndex);
      setCurrentTopic(boundedIndex);
    }
  }, [patientSymptoms.length, currentIndex]);

  useEffect(() => {
    setSurveyState((prev) => {
      if (!prev.topics || !prev.topics[currentTopic]) return prev;
      const copy = [...prev.topics];
      const latestResponse = responses[currentIndex];
      copy[currentTopic].component1 = latestResponse?.component1;
      const q2responses = latestResponse?.component2?.split("\n") || [];
      copy[currentTopic].component2 = q2responses.map((response, qIdx) => {
        return {
          question: qIdx.toString(),
          answer: response,
        };
      });
      return { ...prev, topics: copy };
    });
  }, [responses, currentIndex, currentTopic]);

  if (!code) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen">
        <p className="text-lg font-semibold">No access code provided.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen">
        <p className="text-lg font-semibold">Loading survey...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen">
        <p className="text-lg font-semibold text-red-500">{error}</p>
      </div>
    );
  }

  if (surveyItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen">
        <p className="text-lg font-semibold">No survey items found.</p>
      </div>
    );
  }

  const isLast = currentIndex === surveyItems.length / 3 - 1;
  const currentResponse = responses[currentIndex] || {};
  const component1Answered = !!currentResponse.component1;
  const component2Visited = !!responses[currentIndex]?.component2;

  const handleComponent1Response = (value: string) => {
    setResponses((prev) => ({
      ...prev,
      [currentIndex]: { ...prev[currentIndex], component1: value },
    }));
  };

  const handleComponent2Response = (value: string) => {
    setResponses((prev) => ({
      ...prev,
      [currentIndex]: { ...prev[currentIndex], component2: value },
    }));
  };

  const handleNext = async () => {
    if (!isLast) {
      const nextIndex = currentIndex + 1;
      const isBrandNew = !responses[nextIndex]?.component1;

      setCurrentIndex(nextIndex);
      setCurrentTopic(nextIndex);

      if (isBrandNew) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      await saveSurvey(surveyState);
      window.location.href = "/complete";
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setCurrentTopic(prevIndex);
    }
  };

  const getConversationSnippets = (index: number) => {
    return [
      surveyItems[index * 3].dialog,
      surveyItems[index * 3 + 1].dialog,
      surveyItems[index * 3 + 2].dialog,
    ];
  };

  const getPreviousProtocols = (index: number) => {
    return [
      surveyItems[index * 3].previousProtocol,
      surveyItems[index * 3 + 1].previousProtocol,
      surveyItems[index * 3 + 2].previousProtocol,
    ];
  };

  const getNextProtocols = (index: number) => {
    return [
      surveyItems[index * 3].nextProtocol,
      surveyItems[index * 3 + 1].nextProtocol,
      surveyItems[index * 3 + 2].nextProtocol,
    ];
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen px-8">
      {/* Progress Bar */}
      <div className="w-full max-w-4xl sticky top-0 bg-green1 z-50 px-8 py-4 shadow-md rounded-b-xl">
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-4 bg-green2 rounded-full transition-all duration-500"
            style={{
              width: `${((currentIndex + 1) / patientSymptoms.length) * 100}%`,
            }}
          />
        </div>
        <p className="text-sm font-semibold mt-1 text-right">
          Question {currentIndex + 1} of {patientSymptoms.length}
        </p>
      </div>

      <div className="mt-10">
        {/* Component 1 */}
        <Component1
          key={`q-${currentIndex}-${responses[currentIndex]?.component1 || "empty"}`}
          data={{
            id: patientDemographics[currentIndex].id,
            sex: patientDemographics[currentIndex].sex,
            age: patientDemographics[currentIndex].age,
            flowchart_options: patientDemographics[currentIndex].options,
            patientDialog: patientSymptoms[currentIndex],
          }}
          onResponse={handleComponent1Response}
          savedResponse={currentResponse.component1}
          onSubmit={handleSubmit}
        />
        {/* Component 2 - Only show after Component1 is answered */}
        {component1Answered && (
          <div>
            <Component2
              key={`topic-${currentIndex}`}
              flowchartName={patientDemographics[currentIndex].flowchart}
              snippets={getConversationSnippets(currentIndex)}
              previousProtocols={getPreviousProtocols(currentIndex)}
              nextProtocols={getNextProtocols(currentIndex)}
              onResponse={handleComponent2Response}
              savedResponse={currentResponse.component2}
              ref={component2Ref}
            />

            {/* Navigation */}

            <div className="flex gap-4 align-self-center justify-center mt-12 mb-36">
              {currentIndex > 0 && (
                <button
                  onClick={handleBack}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded transition-colors"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={currentIndex === 10} // Last component
                className="bg-green1 hover:bg-green2 disabled:opacity-50 text-white font-bold py-2 px-4 rounded"
              >
                {isLast ? "Complete" : "Next"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
