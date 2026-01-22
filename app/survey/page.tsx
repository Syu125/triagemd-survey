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
  const [responses, setResponses] = useState<{
    [key: number]: { component1?: string; component2?: string };
  }>({});

  const component2Ref = useRef<HTMLDivElement>(null);

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
    // Scroll to Component2 smoothly
    setTimeout(() => {
      component2Ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  };
  // Load survey data based on code
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
  console.log("Current Item:", currentItem); // Debugging line
  const isLast = currentIndex === surveyItems.length - 1;
  const currentResponse = responses[currentIndex] || {};
  const component1Answered = !!currentResponse.component1;

  const handleComponent1Response = (value: string) => {
    setResponses({
      ...responses,
      [currentIndex]: { ...currentResponse, component1: value },
    });
  };

  const handleComponent2Response = (value: string) => {
    setResponses({
      ...responses,
      [currentIndex]: { ...currentResponse, component2: value },
    });
  };

  const handleNext = () => {
    if (!isLast) setCurrentIndex(currentIndex + 1);
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
    <div className="flex flex-col items-center  w-full min-h-screen px-8 py-8 gap-8">
      {/* Progress indicator */}
      <p className="text-lg font-semibold">
        Question {currentIndex + 1} of {patientSymptoms.length}
      </p>

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
          <div className="flex gap-4 align-self-center justify-center mt-8">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="bg-gray-500 hover:bg-gray-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded"
            >
              Previous
            </button>
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
  );
}
