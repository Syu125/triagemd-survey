"use client";
import { useState } from "react";
import Component1 from "@/components/Question/Component1";
import Component2 from "@/components/Question/Component2";

const surveyItems = [
  { id: 1, data: "Item 1 data" },
  { id: 2, data: "Item 2 data" },
  // ... repeat 10 times
  { id: 10, data: "Item 10 data" },
];

export default function Survey() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<{
    [key: number]: { component1?: string; component2?: string };
  }>({});

  const currentItem = surveyItems[currentIndex];
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
        data={currentItem}
        onResponse={handleComponent1Response}
        savedResponse={currentResponse.component1}
      />

      {/* Component 2 - Only show after Component1 is answered */}
      {component1Answered && (
        <Component2
          data={currentItem}
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
