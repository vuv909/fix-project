import React, { useEffect, useState } from "react";
import Flashcard from "../FlashCard";
import { Button } from "primereact/button";

const FlashcardList = ({ flashcards, showAnswer, setShowAnswer, currentCardIndex, setCurrentCardIndex }) => {
  

  const handleNextCard = (e) => {
    e.stopPropagation();
    setShowAnswer(false);
    setCurrentCardIndex((prevIndex) =>
      prevIndex === flashcards.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePreviousCard = (e) => {
    e.stopPropagation();
    setShowAnswer(false);
    setCurrentCardIndex((prevIndex) =>
      prevIndex === 0 ? flashcards.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Previous Card Button */}
      <Button
        tooltip="Câu trước"
        icon="pi pi-chevron-left"
        className="rounded-full h-10 w-10 bg-blue-500 text-white font-bold absolute left-0 top-1/2 transform -translate-y-1/2"
        onClick={handlePreviousCard}
      ></Button>

      {/* Flashcard Display */}
      <div className="flex items-center justify-between gap-16 mt-8">
        <Flashcard
          flashcard={flashcards[currentCardIndex]}
          showAnswer={showAnswer}
          setShowAnswer={setShowAnswer}
        />
      </div>

      {/* Next Card Button */}
      <Button
        tooltip="Câu tiếp theo"
        icon="pi pi-chevron-right"
        className="rounded-full h-10 w-10 bg-blue-500 text-white font-bold absolute right-0 top-1/2 transform -translate-y-1/2"
        onClick={handleNextCard}
      ></Button>
    </div>
  );
};

export default FlashcardList;
