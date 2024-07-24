import React, { useState, useEffect } from "react";
import QuizResult from "../../components/QuizResult";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { ProgressBar } from "primereact/progressbar";

const TestQuiz = ({ quizData }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState(
    new Array(quizData?.length).fill("")
  );
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showNext, setShowNext] = useState(false);
  const [timeLeft, setTimeLeft] = useState(quizData?.length * 15);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Calculate progress percentage
  const progress = Math.max(((currentQuestionIndex + 1) / quizData.length) * 100, 0).toFixed(2);


  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 0) {
          clearInterval(timer); // Stop the timer
          handleQuizCompletion(); // Handle quiz completion when time runs out
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    if (!quizCompleted) {
      // Clean up function for component unmount or tab close
      const cleanup = () => {
        clearInterval(timer); // Stop the timer
        handleQuizCompletion(); // Handle quiz completion when user navigates away
      };

      // Event listener for handling user navigation
      window.addEventListener("beforeunload", confirmExit);
      window.addEventListener("popstate", confirmExit);

      function confirmExit(event) {
        // Display a confirmation dialog
        event.preventDefault();
        event.returnValue = "";
        return "";
      }

      return () => {
        window.removeEventListener("beforeunload", confirmExit);
        window.removeEventListener("popstate", confirmExit);
        clearInterval(timer);
      };
    }
  }, [currentQuestionIndex, quizCompleted]);

  const handleAnswerSelect = (answerId) => {
    setSelectedAnswer(answerId);

    const isCorrect = quizData[currentQuestionIndex].quizAnswers.find(
      (answer) => answer.id === answerId
    ).isCorrect;

    setUserAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[currentQuestionIndex] = answerId;
      return updatedAnswers;
    });
  };

  const handleNextQuestion = () => {
    setSelectedAnswer("");
    setShowNext(false);
    if (currentQuestionIndex + 1 < quizData.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleQuizCompletion();
    }
  };

  const handleQuizCompletion = () => {
    setQuizCompleted(true); // Set quizCompleted to true
  };

  if (quizCompleted) {
    return (
      <QuizResult
        totalQuestions={quizData.length}
        quizData={quizData}
        userAnswers={userAnswers}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-3/4 rounded shadow-md h-4/5 p-20">
        <div className="flex justify-between items-center">
          <div>
            Thời gian làm bài: {Math.floor(timeLeft / 60)}:
            {timeLeft % 60 < 10 ? "0" + (timeLeft % 60) : timeLeft % 60}
          </div>
        </div>
        <div>
          <ProgressBar value={progress} title={`${currentQuestionIndex+1}/${quizData?.length}`}></ProgressBar>
        </div>
        <h2 className="text-xl font-bold mt-4">
          {quizData[currentQuestionIndex]?.content}
        </h2>
        <div className="mt-4 space-y-2">
          {quizData[currentQuestionIndex]?.quizAnswers.map((answer) => (
            <button
              key={answer.id}
              onClick={() => handleAnswerSelect(answer.id)}
              className={`block w-full p-2 rounded-md text-left ${
                selectedAnswer === answer.id
                  ? "bg-blue-500 text-white"
                  : userAnswers[currentQuestionIndex] === answer.id
                  ? "bg-red-300"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {answer?.content}
            </button>
          ))}
        </div>
        {selectedAnswer !== "" && (
          <button
            onClick={handleNextQuestion}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md cursor-pointer"
          >
            {currentQuestionIndex === quizData.length - 1
              ? "Kết thúc"
              : "Câu tiếp theo"}
          </button>
        )}
      </div>
    </div>
  );
};

export default TestQuiz;
