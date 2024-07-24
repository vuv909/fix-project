import React, { useState } from "react";
import Topic from "../Topic";
import Lesson from "../Lesson";
import classNames from "classnames";
import ManagementQuizLesson from "../ManagementQuizLesson";
import ManageQuestionQuiz from "../ManageQuestionQuiz";

export default function QuizManagement() {
  const [navIndex, setNavIndex] = useState(1);

  return (
    <div>
      {/* menubar */}
      <div className="flex justify-start border-b-2 mb-5 border-[#D1F7FF]">
        <h1
          className={classNames("p-5 cursor-pointer hover:bg-[#D1F7FF]", {
            "bg-[#D1F7FF] font-bold": navIndex === 1,
          })}
          onClick={() => setNavIndex(1)}
        >
          Các bài quiz
        </h1>
        <h1
          className={classNames("p-5 cursor-pointer hover:bg-[#D1F7FF]", {
            "bg-[#D1F7FF] font-bold": navIndex === 2,
          })}
          onClick={() => setNavIndex(2)}
        >
          Câu hỏi quiz
        </h1>
      </div>
      {navIndex === 1 && <ManagementQuizLesson />}
      {navIndex === 2 && <ManageQuestionQuiz />}
    </div>
  );
}
