import { useState, useMemo } from 'react';
import { ChevronLeft, AlertTriangle, Check } from 'lucide-react';
import type { EmergencyQuestion, QuestionAnswer } from '@/types';

interface QuestionFlowProps {
  questions: EmergencyQuestion[];
  onComplete: (answers: QuestionAnswer[]) => void;
  onSkip: () => void;
}

export function QuestionFlow({ questions, onComplete, onSkip }: QuestionFlowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const question = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const hasLifeThreateningAnswer = useMemo(
    () =>
      questions.some(
        (q) =>
          answers[q.id] &&
          q.lifeThreateningAnswers?.includes(answers[q.id])
      ),
    [questions, answers]
  );

  const handleAnswer = (answer: string) => {
    const newAnswers = { ...answers, [question.id]: answer };
    setAnswers(newAnswers);

    if (isLast) {
      const result: QuestionAnswer[] = questions.map((q) => ({
        questionId: q.id,
        prompt: q.prompt,
        answer: newAnswers[q.id] ?? 'Unknown',
      }));
      onComplete(result);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <button
            onClick={onSkip}
            className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors"
          >
            Skip questions
          </button>
        </div>
        <div className="h-2 w-full rounded-full bg-blue-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Life-threatening alert — shows if any answer so far is life-threatening */}
      {hasLifeThreateningAnswer && (
        <div className="rounded-xl bg-red-50 border-2 border-red-300 px-4 py-3 animate-fade-in">
          <div className="flex gap-2.5">
            <AlertTriangle size={20} className="shrink-0 text-red-600 mt-0.5" />
            <p className="text-sm font-bold text-red-900 leading-relaxed">
              This may be life-threatening. Call your local emergency number now.
            </p>
          </div>
        </div>
      )}

      {/* Question card */}
      <div className="card p-6 animate-fade-in" key={question.id}>
        <h2 className="text-xl font-bold text-gray-900 leading-snug mb-5">
          {question.prompt}
        </h2>

        <div className="flex flex-col gap-3">
          {question.options.map((option) => {
            const isSelected = answers[question.id] === option;
            const isDanger =
              question.lifeThreateningAnswers?.includes(option);
            return (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className={`flex items-center justify-between rounded-2xl px-5 py-4 text-lg font-semibold transition-all active:scale-[0.98] ${
                  isSelected
                    ? 'bg-blue-600 text-white border-2 border-blue-600'
                    : isDanger
                      ? 'bg-white text-gray-900 border-2 border-red-200 hover:border-red-400 hover:bg-red-50'
                      : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                <span className="text-left">{option}</span>
                {isSelected && <Check size={22} className="shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Back button */}
      <div className="flex items-center gap-2">
        {currentIndex > 0 ? (
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ChevronLeft size={18} />
            Go back
          </button>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
