import React from "react";
import "./index.css";
import { Image } from "primereact/image";
import parse from "html-react-parser";

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
      onClick={(e)=>{e?.stopPropagation()}}
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

const renderHtmlContent = (content) => {
  // Replace <img> tags with CustomImage components
  if (!content) return null; 

  const options = {
    replace: ({ name, attribs, children }) => {
      if (name === "img") {
        const { src, alt, width } = attribs;
        return <CustomImage src={src} alt={alt} width={width} />;
      }
      return null; // Return null for all other elements to render them as is
    },
  };

  return parse(content, options);
};

const Flashcard = ({ flashcard, showAnswer, setShowAnswer }) => {
  // Function to convert index to letter (A, B, C, D, ...)
  const indexToLetter = (index) => {
    return String.fromCharCode(65 + index); // ASCII code for 'A' is 65
  };

  // Find all correct answers
  const correctAnswers = flashcard?.quizAnswers.filter(
    (answer) => answer.isCorrect
  );

  return (
    <div className={`max-w-md rounded overflow-hidden bg-white p-6 mb-4`}>
      {!showAnswer ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-center w-full mb-5">
              {renderHtmlContent(flashcard?.content)}
            </h2>
          </div>
          <div className="flex flex-wrap gap-10">
            {flashcard?.quizAnswers?.map((answer, index) => (
              <div key={index} style={{ flexBasis: "45%" }}>
                <strong>{indexToLetter(index)}:</strong> {answer?.content}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div>
          {correctAnswers?.map((correctAnswer, index) => (
            <div key={index}>
              <strong>
                {indexToLetter(
                  flashcard?.quizAnswers?.indexOf(correctAnswer)
                )}
                :
              </strong>{" "}
              {correctAnswer?.content}
            </div>
          ))}
          <div>
            <h1 className="text-blue-600 font-semibold">Giải thích: </h1>
            <span>{renderHtmlContent(flashcard?.hint)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Flashcard;
