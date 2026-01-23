"use client";
import { useState, useEffect } from "react";
import Component1 from "@/components/Question/Component1";
import Component2 from "@/components/Question/Component2";
import { useCode } from "@/context/CodeContext";
import { CODE_TO_VERSION, FLOWCHART_GROUPS } from "@/constants";
import { loadSurveyData, SurveyItem } from "@/lib/surveyDataLoader";
import { useRef } from "react";

export default function Survey() {
  const { code } = useCode();
  const [surveyItems, setSurveyItems] = useState<SurveyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const initialYes = Array(12).fill("Yes").join("\n");

  const [responses, setResponses] = useState<{
    [key: number]: { component1?: string; component2?: string };
  }>({
    0: {
      component2: initialYes,
    },
  });

  const component2Ref = useRef<HTMLDivElement>(null);

  // Survey storage
  type Component2Answer = {
    question: string;
    answer: string | null | undefined;
  };

  type TopicAnswers = {
    component1: string | null | undefined;
    component2: Component2Answer[];
  };

  type SurveyState = {
    code: string;
    surveyId: number;
    topics: TopicAnswers[];
  };

  type metricQuestions = {
    relevance: string;
    decisiveness: string;
    clinicalAccuracy: string;
    uncertaintyCalibration: string;
  };

  const [surveyState, setSurveyState] = useState<SurveyState>({
    code: code || "",
    surveyId: 1,
    topics: Array.from({ length: 10 }, () => ({
      component1: null,
      component2: [],
    })),
  });

  const [currentTopic, setCurrentTopic] = useState(0); // 0–9

  // For Component 1
  const [patientSymptoms, setPatientSymptoms] = useState<string[]>([]);
  interface PatientDemographics {
    id: number;
    sex: string;
    age: string;
    options: string[];
  }
  const [patientDemographics, setPatientDemographics] = useState<
    PatientDemographics[]
  >([]);

  const progress = ((currentIndex + 1) / patientSymptoms.length) * 100;

  // For Component 2

  const getFlowchartOptions = (flowchartName: string): string[] => {
    // Find the group that contains this flowchart
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

        const data = await loadSurveyData(versionIndex);
        // console.log("Loaded survey data:", data[0].flowchart); // Debugging line
        setSurveyItems(data);
        const symptomsList: string[] = [];
        const demographics: PatientDemographics[] = [];
        for (let i = 0; i < 10; i++) {
          const entry = data[i * 3];
          const patientMatch = entry.dialog.match(
            /Patient:\s*(.+?)(?=\nTriageMD:|$)/,
          );
          symptomsList.push(patientMatch ? patientMatch[1].trim() : "");
          demographics.push({
            id: entry.id,
            sex: entry.sex,
            age: entry.age,
            options: getFlowchartOptions(entry.flowchart),
          });
        }
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
    setSurveyState((prev) => {
      const copy = [...prev.topics];
      const latestResponse = responses[currentIndex];
      // console.log("Latest response at submit:", latestResponse);
      copy[currentTopic].component1 = latestResponse?.component1;
      console.log(
        "Updating topic ",
        currentTopic,
        " with answer: ",
        latestResponse?.component1,
        " and copy: ",
        copy,
      );
      const q2responses = latestResponse?.component2?.split("\n") || [];
      console.log("q2responses:", latestResponse?.component2, q2responses);
      copy[currentTopic].component2 = q2responses.map((response, qIdx) => {
        return {
          question: qIdx.toString(),
          answer: response,
        };
      });
      console.log("Updated component2 answers:", copy[currentTopic].component2);
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

  const currentItem = surveyItems[currentIndex];
  // console.log("Current Item:", currentItem); // Debugging line
  const isLast = currentIndex === surveyItems.length - 1;
  const currentResponse = responses[currentIndex] || {};
  const component1Answered = !!currentResponse.component1;

  const handleComponent1Response = (value: string) => {
    // console.log("Component 1 response received:", currentIndex, ", ", value);
    setResponses((prev) => ({
      ...prev,
      [currentIndex]: { ...prev[currentIndex], component1: value },
    }));
    // console.log("Updated response: ", responses);
  };

  const handleComponent2Response = (value: string) => {
    console.log("Component 2 response received:", currentIndex, ", ", value);
    setResponses((prev) => ({
      ...prev,
      [currentIndex]: { ...prev[currentIndex], component2: value },
    }));
  };

  const handleNext = () => {
    if (!isLast) setCurrentIndex(currentIndex + 1);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    if (currentTopic < 9) setCurrentTopic((t) => t + 1);
    console.log("Survey state at ", currentTopic, ": ", surveyState);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };
  const getPatientDialog = (dialog: string): string => {
    // Extract the patient's first message (before "TriageMD:")
    const patientMatch = dialog.match(/Patient:\s*(.+?)(?=\nTriageMD:|$)/);
    return patientMatch ? patientMatch[1].trim() : "";
  };

  const getConversationSnippets = (index: number) => {
    return [
      surveyItems[index].dialog,
      surveyItems[index + 1].dialog,
      surveyItems[index + 2].dialog,
    ];
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen px-8">
      {/* Progress Bar */}
      <div className="w-full max-w-4xl sticky top-0 bg-white z-50 px-8 py-4 shadow-md">
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-4 bg-blue-500 rounded-full transition-all duration-500"
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
              snippets={getConversationSnippets(currentIndex)}
              onResponse={handleComponent2Response}
              savedResponse={currentResponse.component2}
              ref={component2Ref}
            />

            {/* Navigation */}
            <div className="flex gap-4 align-self-center justify-center mt-12 mb-36">
              <button
                onClick={handleNext}
                disabled={currentIndex === 9} // Last component
                className="bg-blue-500 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded"
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
