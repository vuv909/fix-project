import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import Footer from "../../components/Footer";
import CategoryOfClass from "../../components/CategoryOfClass";
import DocumentClass from "../../components/DocumentClass";
import Comment from "../../components/Comment";
import LessonInDocument from "../../components/LessonInDocument";
import {
  getDocumentListByLessonId,
  getLessonById,
} from "../../services/lesson.api";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import { Button } from "primereact/button";
import restClient from "../../services/restClient";
import { decodeIfNeeded, isBase64 } from "../../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { Editor } from "primereact/editor";
import './index.css'

export default function Lesson() {
  const navigate = useNavigate();
  const fixedDivRef = useRef(null);
  const [fixedDivHeight, setFixedDivHeight] = useState(0);
  const [isDisplay, setIsDisplay] = useState(false);
  const displayRef = useRef(null);
  const [lesson, setLesson] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingV1, setLoadingV1] = useState(false);
  const [documentList, setDocumentList] = useState({});
  const [tableContentId, setTableContentId] = useState([]);
  const { id } = useParams();

  const fetchData = async () => {
    try {
      const responseTopic = await restClient({
        url: `api/index/getalllessonindex/${id}`,
        method: "GET",
      });

      console.log("Response Topic:", responseTopic);

      const lessonId = responseTopic.data?.data?.id;

      if (lessonId) {
        const responseMenu = await restClient({
          url: `api/index/getalldocumentindex/${lessonId}`,
          method: "GET",
        });

        setDocumentList(responseMenu.data?.data);
      } else {
        console.log("Lesson ID not found in response data.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Optionally, you can set an error state or handle the error in another way
    }
  };

  useEffect(() => {
    getLessonById(id, setLoading, setLesson);
    fetchData();
  }, [id]);

  useEffect(() => {
    if (Array.isArray(documentList?.topics)) {
      const mappedData =
        documentList && documentList.topics
          ? documentList.topics.reduce((acc, topic) => {
              acc.push(`topic : ${topic.id}`);

              // Map lessons if present
              if (Array.isArray(topic.lessons)) {
                topic.lessons.forEach((lesson) => {
                  acc.push(`lesson : ${lesson.id}`);
                });
              }

              // Map child topics if present
              if (Array.isArray(topic.childTopics)) {
                topic.childTopics.forEach((childTopic) => {
                  acc.push(`topic : ${childTopic.id}`);

                  // Map lessons of child topic if present
                  if (Array.isArray(childTopic.lessons)) {
                    childTopic.lessons.forEach((lesson) => {
                      acc.push(`lesson : ${lesson.id}`);
                    });
                  }
                });
              }

              return acc;
            }, [])
          : [];
      setTableContentId(mappedData);
    }
  }, [documentList]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsDisplay(true);
          } else {
            setIsDisplay(false);
          }
        });
      },
      {
        threshold: 0,
      }
    );

    if (displayRef.current) {
      observer.observe(displayRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (fixedDivRef.current) {
      setFixedDivHeight(fixedDivRef.current.offsetHeight);
    }
  }, [fixedDivRef]);

  const handleDownload = () => {
    window.open(`${lesson?.urlDownload}`);
  };

  const handlePrevious = () => {
    const idNavi = findPreviousLessonId(tableContentId, id);
    if (idNavi) {
      const key = idNavi.split(" : ")[0];
      const value = idNavi.split(" : ")[1];
      if (key == "lesson") {
        navigate(`/document/${key}/${value}`);
      } else {
        navigate(`/${key}/${value}`);
      }
    }
  };

  const handleNext = () => {
    const idNavi = findNextLessonId(tableContentId, id);
    if (idNavi) {
      const key = idNavi.split(" : ")[0];
      const value = idNavi.split(" : ")[1];
      if (key == "lesson") {
        navigate(`/document/${key}/${value}`);
      } else {
        navigate(`/${key}/${value}`);
      }
    }
  };

  const findNextLessonId = (data, currentLessonId) => {
    // Find the index of the current lesson in the data array
    const currentIndex = data.findIndex((item) => {
      const itemType = item.split(" : ")[0]; // Get item type ("lesson" or "topic")
      const itemId = parseInt(item.split(" : ")[1]); // Get item ID
      return itemType === "lesson" && itemId === Number(currentLessonId);
    });

    if (currentIndex === -1 || currentIndex === data?.length - 1) {
      return null; // Current lesson ID not found in data
    }

    // Find the previous lesson ID
    for (let i = currentIndex + 1; i >= 0; i--) {
      const item = data[i];
      return item;
    }

    return null;
  };

  const findPreviousLessonId = (data, currentLessonId) => {
    // Find the index of the current lesson in the data array
    const currentIndex = data.findIndex((item) => {
      const itemType = item.split(" : ")[0]; // Get item type ("lesson" or "topic")
      const itemId = parseInt(item.split(" : ")[1]); // Get item ID
      return itemType === "lesson" && itemId === Number(currentLessonId);
    });

    if (currentIndex === -1 || currentIndex === 0) {
      return null; // Current lesson ID not found in data
    }

    // Find the previous lesson ID
    for (let i = currentIndex - 1; i >= 0; i--) {
      const item = data[i];
      return item;
    }

    return null;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div ref={fixedDivRef} className="fixed top-0 w-full z-50">
        <Header />
        <Menu />
      </div>
      <div style={{ paddingTop: `${fixedDivHeight}px` }} className="flex gap-5">
        <LessonInDocument
          display={isDisplay}
          documentList={documentList}
          lessonId={id}
          fixedDivRef={fixedDivRef}
        />

        <div className="pt-6 flex-1">
          {loading ? (
            <Loading />
          ) : Object.keys(lesson).length > 0 ? (
            <>
              <div>
                <div className="flex justify-between mb-10">
                  <button
                    onClick={handlePrevious}
                    className="flex items-center bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                    Trang trước
                  </button>
                  {lesson && lesson?.urlDownload && (
                    <button
                      onClick={handleDownload}
                      className="flex items-center bg-green-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <FontAwesomeIcon icon={faDownload} className="mr-2" />
                      Tải tài liệu về máy
                    </button>
                  )}
                  <button
                    className="flex items-center bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={handleNext}
                  >
                    Trang sau
                    <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                  </button>
                </div>
                <h2 className="text-xl font-bold">{lesson?.title}</h2>

                {/* Add more details based on your lesson object */}
              </div>
              {isBase64(lesson.content) ? (
                // <div
                //   className="ql-editor"
                //   dangerouslySetInnerHTML={{
                //     __html: decodeIfNeeded(lesson.content),
                //   }}
                // />
                <Editor value={decodeIfNeeded(lesson?.content)} readOnly={true} headerTemplate={<></>} className="custom-editor-class" />
              ) : (
                <Editor value={lesson?.content} readOnly={true} headerTemplate={<></>} className="custom-editor-class"  />
                // <div
                //   className="ql-editor" // Add Quill's class if necessary
                //   dangerouslySetInnerHTML={{
                //     __html: lesson.content,
                //   }}
                // />
              )}
            </>
          ) : (
            <p>No lesson data found.</p>
          )}
        </div>
      </div>

      <Footer ref={displayRef} />
    </div>
  );
}
