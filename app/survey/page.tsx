"use client";
import { useState, useEffect } from "react";
import Component1 from "@/components/Question/Component1";
import Component2 from "@/components/Question/Component2";
import { useCode } from "@/context/CodeContext";
import { CODE_TO_VERSION } from "@/constants";
import { loadSurveyData, SurveyItem } from "@/lib/surveyDataLoader";

export default function Survey() {
  const { code } = useCode();
  const [surveyItems, setSurveyItems] = useState<SurveyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<{
    [key: number]: { component1?: string; component2?: string };
  }>({});

  // Load survey data based on code
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const versionIndex = CODE_TO_VERSION[code.toUpperCase()];
        console.log("Version Index:", versionIndex); // Debugging line
        if (!versionIndex) {
          setError("Invalid code");
          return;
        }

        const data = await loadSurveyData(versionIndex);
        console.log("Loaded survey data:", data[0].flowchart); // Debugging line
        setSurveyItems(data);
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

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen px-8 py-8 gap-8">
      {/* Progress indicator */}
      <p className="text-lg font-semibold">
        Question {currentIndex + 1} of {surveyItems.length}
      </p>

      {/* Component 1 */}
      <Component1
        data={{
          id: currentItem.id,
          sex: currentItem.sex,
          age: currentItem.age,
        }}
        onResponse={handleComponent1Response}
        savedResponse={currentResponse.component1}
      />

      {/* Component 2 - Only show after Component1 is answered */}
      {component1Answered && (
        <Component2
          data={{ sex: currentItem.sex, age: currentItem.age }}
          onResponse={handleComponent2Response}
          savedResponse={currentResponse.component2}
        />
      )}

      {/* Navigation */}
      <div className="flex gap-4">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="bg-gray-500 hover:bg-gray-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={isLast}
          className="bg-blue-500 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded"
        >
          {isLast ? "Complete" : "Next"}
        </button>
      </div>
    </div>
  );
}
