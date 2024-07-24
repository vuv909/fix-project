import React, { useState, useEffect, useRef } from "react";
import QuizResult from "../../components/QuizResult";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import parse from "html-react-parser";
import "./index.css";

const CustomImage = ({ src, alt, width }) => {
  const zoomIcon = () => {
    return <i className="pi pi-plus text-white"></i>;
  };
  const zoomOutIcon = () => {
    return <i className="pi pi-minus text-white"></i>;
  };
  const closeIcon = () => {
    return <i className="pi pi-times text-white"></i>;
  };
  return (
    <Image
      src={src}
      zoomSrc={src}
      alt={alt}
      className="hover:brightness-50 transition-all duration-300"
      style={{ width: width }}
      zoomInIcon={zoomIcon}
      zoomOutIcon={zoomOutIcon}
      closeIcon={closeIcon}
      rotateLeftIcon={<></>}
      rotateRightIcon={<></>}
      preview
    />
  );
};

const ViewQuestionInTest = ({ quizData, quizDetail }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const questionRefs = useRef([]);

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
    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // const handleAnswerSelect = (questionId, answerId) => {
  //   setSelectedAnswers((prevState) => ({
  //     ...prevState,
  //     [questionId]: answerId,
  //   }));
  // };
  const handleAnswerSelect = (questionId, answerId) => {
    setSelectedAnswers((prevState) => {
      // Check if the answerId is already in the array
      const isSelected = prevState[questionId]?.includes(answerId);

      if (isSelected) {
        // Remove answerId from the array if already selected
        const updatedAnswers = prevState[questionId].filter(
          (id) => id !== answerId
        );
        return {
          ...prevState,
          [questionId]:
            updatedAnswers.length === 0 ? undefined : updatedAnswers, // Remove key if array is empty
        };
      } else {
        // Add answerId to the array if not selected
        return {
          ...prevState,
          [questionId]: [...(prevState[questionId] || []), answerId],
        };
      }
    });
  };

  const isAnswerSelected = (questionId, answerId) => {
    return selectedAnswers[questionId] === answerId;
  };

  const scrollToQuestion = (index) => {
    const element = questionRefs.current[index];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleQuizCompletion = () => {
    setQuizCompleted(true);
  };

  const renderHtmlContent = (content) => {
    // Replace <img> tags with CustomImage components
    const options = {
      replace: ({ name, attribs, children }) => {
        if (name === "img") {
          const { src, alt, width } = attribs;
          return <CustomImage src={src} alt={alt} width={width} />;
        }
      },
    };

    return parse(content, options);
  };

  const handleAnswerSelectOne = (questionId, answerId) => {
    setSelectedAnswers((prevState) => ({
      ...prevState,
      [questionId]: answerId,
    }));
  };

  const isAnswerSelectedOne = (questionId, answerId) => {
    return selectedAnswers[questionId] === answerId;
  };

  const handleSubmitQuiz = () => {
    // Prepare data in the required format before submitting
    const questionAnswerDto = Object.keys(selectedAnswers).map(
      (questionId) => ({
        type: 1,
        questionId: parseInt(questionId), // Ensure questionId is converted to number
        answerId: [selectedAnswers[questionId]], // Convert answerId to array as expected
      })
    );

    const quizId = quizDetail?.id; // Assuming quizDetail has an id field
    const userId = "string"; // Replace with actual user ID if available

    // Example object to be sent
    const dataToSend = {
      questionAnswerDto,
      quizId,
      userId,
    };

    // Here you can perform an API call to submit dataToSend
    console.log("Data to send:", dataToSend);

    // For demonstration purposes, reset selectedAnswers after submission
    setSelectedAnswers({});
  };

  if (quizCompleted) {
    return <QuizResult totalQuestions={quizData.length} quizData={quizData} />;
  }

  return (
    <div className="flex justify-center flex-wrap" id="question">
      {/* Question Box */}
      <div className="lesson-box w-3/4 p-4">
        <h1 className="text-center font-bold text-xl mb-3">
          {quizDetail?.title}
        </h1>
        {quizData?.map((question, questionIndex) => (
          <div
            key={question?.id}
            id={`question_${questionIndex}`}
            ref={(el) => (questionRefs.current[questionIndex] = el)}
            className="border shadow-lg p-5 rounded-lg mb-4"
          >
            <p className="font-bold">Câu {`${questionIndex + 1}: `}</p>
            <div>{renderHtmlContent(question.content)}</div>
            <ul className="flex flex-wrap gap-5 mt-5">
              {(question?.type === "QuestionFourAnswer" ||
                question?.type === "QuestionTrueFalse") &&
                question?.quizAnswers?.map((answer, index) => (
                  <li key={answer?.id}>
                    <label>
                      <input
                        type="radio"
                        name={`question_${question.id}`}
                        value={answer.id}
                        checked={isAnswerSelectedOne(question.id, answer.id)}
                        onChange={() =>
                          handleAnswerSelectOne(question.id, answer.id)
                        }
                      />
                      {answer.content}
                    </label>
                  </li>
                ))}

              {question?.type === "QuestionMultiChoice" &&
                question?.quizAnswers?.map((answer, index) => (
                  <li key={answer?.id}>
                    <label>
                      <input
                        type="checkbox"
                        name={`question_${question.id}`}
                        value={answer.id}
                        checked={selectedAnswers[question.id]?.includes(
                          answer.id
                        )}
                        onChange={() =>
                          handleAnswerSelect(question.id, answer.id)
                        }
                      />
                      {answer.content}
                    </label>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Lesson Box */}
      <div className="question-box p-4">
        <Button
          label="Nộp bài"
          className="text-center bg-blue-600 hover:bg-blue-400 text-white w-full mb-2 py-1"
          onClick={handleSubmitQuiz} // Call function to submit quiz
        />
        <div className="text-right text-red-600 underline">
          Thời gian làm bài: {Math.floor(timeLeft / 60)}:
          {timeLeft % 60 < 10 ? "0" + (timeLeft % 60) : timeLeft % 60}
        </div>
        <ul className="flex flex-wrap gap-2 border p-5 justify-center shadow-lg">
          {quizData?.map((question, index) => (
            <li
              key={question.id}
              onClick={()=>scrollToQuestion(index)}
              className={`w-1/4 rounded-full text-center ${
                isAnswerSelected(question.id)
                  ? "border-black border"
                  : "bg-blue-500 text-white"
              }`}
            >
              {`${index + 1}`}
            </li>
          ))}
        </ul>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          icon="pi pi-arrow-up"
          className="back-to-top-btn fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md"
          onClick={scrollToTop}
        />
      )}
    </div>
  );
};

export default ViewQuestionInTest;
