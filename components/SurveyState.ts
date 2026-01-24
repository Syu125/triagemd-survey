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
