import React, { useEffect, useRef } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "primereact/tooltip";

export default function LessonInDocument({
  display,
  documentList,
  lessonId,
  topicId,
  fixedDivRef
}) {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const tooltipTargetRef = useRef(null);

  // Initialize the tooltip options
  const options = {
    position: "top",
  };

  useEffect(() => {
    const scrollToSelectedLesson = () => {
      if (lessonId && scrollContainerRef.current) {
        const selectedLessonElement = scrollContainerRef.current.querySelector(
          `.lesson-${lessonId}`
        );
        if (selectedLessonElement) {
          selectedLessonElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
      if (topicId && scrollContainerRef.current) {
        const selectedTopicElement = scrollContainerRef.current.querySelector(
          `.topic-${topicId}`
        );
        if (selectedTopicElement) {
          selectedTopicElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    };

    setTimeout(() => {
      scrollToSelectedLesson();
    }, 300);
  }, [lessonId, topicId]);

  const getHeight = () => {
    if (fixedDivRef && fixedDivRef.current) {
      const fixedDivHeight = fixedDivRef.current.clientHeight;
      return `calc(100vh - ${fixedDivHeight}px)`;
    }
    return '100vh'; // Default to 100vh if fixedDivRef is not available
  };

  return (
    <div className="w-[18%] bg-gray-100 border-r-2 flex flex-col gap-3 min-h-screen">
      <div
        className={`fixed w-[18%] ${
          display
            ? "transition duration-200 ease-in-out opacity-0"
            : "transition duration-200 ease-in-out opacity-100"
        } `}
      >

        <div
          className="overflow-y-auto custom-scrollbar"
          style={{ height: getHeight() }}
          ref={scrollContainerRef}
        >
          {documentList &&
            documentList.topics &&
            documentList.topics.map((topic) => (
              <div key={topic.id} className="">
                <h2
                  className={`font-semibold pl-1 text-lg topic-${topic.id} ${
                    Number(topicId) === Number(topic.id) &&
                    "bg-[#4dceef]"
                  } hover:bg-[#4dceef] cursor-pointer`}
                  onClick={() => navigate("/topic/" + topic.id)}
                >
                  {topic.title}
                </h2>
                <ul className="">
                  {Array.isArray(topic.lessons) &&
                    topic.lessons.map((lesson, i) => (
                      <li
                        key={lesson.id}
                        className={`lesson-${lesson.id} pl-1 ${
                          Number(lessonId) === Number(lesson.id) &&
                          "bg-[#4dceef]"
                        } hover:bg-[#4dceef] cursor-pointer`}
                        onClick={() =>
                          navigate("/document/lesson/" + lesson.id)
                        }
                      >
                        {lesson.title}
                      </li>
                    ))}
                </ul>
                {topic.childTopics &&
                  topic.childTopics.map((childTopic) => (
                    <div key={childTopic.id} className="">
                      <h3
                        className={`topic-${
                          childTopic.id
                        } font-semibold pl-1 text-base ${
                          Number(topicId) === Number(childTopic.id) &&
                          "bg-[#4dceef]"
                        } hover:bg-[#4dceef] cursor-pointer`}
                        onClick={() => navigate("/topic/" + childTopic.id)}
                      >
                        {childTopic.title}
                      </h3>
                      {childTopic.lessons &&
                        childTopic.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className={`lesson-${lesson.id} pl-1 ${
                              Number(lessonId) === Number(lesson.id) &&
                              "bg-[#4dceef]"
                            } hover:bg-[#4dceef] cursor-pointer`}
                            onClick={() =>
                              navigate("/document/lesson/" + lesson.id)
                            }
                          >
                            {lesson.title}
                          </div>
                        ))}
                    </div>
                  ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
