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
import { faBook, faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Quiz() {
  const fixedDivRef = useRef(null);
  const [fixedDivHeight, setFixedDivHeight] = useState(0);
  const displayRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const navigate = useNavigate()

  const fetchData = async () => {
    setLoading(true);
    try {
      const quizResponse = await restClient({
        url: `api/quiz/getquizbyid/${id}`,
        method: "GET",
      });
      if (quizResponse.data?.data) {
        setQuiz(quizResponse.data.data);
      } else {
        setQuiz(null); // Set quiz to null if not found
      }
    } catch (e) {
      setQuiz(null); // Set quiz to null if there's an error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    if (fixedDivRef.current) {
      setFixedDivHeight(fixedDivRef.current.offsetHeight);
    }
  }, [fixedDivRef]);

  return (
    <div className="">
      <div ref={fixedDivRef} className="fixed top-0 w-full z-50">
        <Header />
        <Menu />
      </div>
      <div
        style={{ paddingTop: `${fixedDivHeight}px` }}
        className="flex justify-center items-center gap-5 h-screen bg-gray-100"
      >
        <div className="w-1/2 shadow-lg rounded-md bg-white p-5">
          {loading ? (
            <Loading />
          ) : (
            <div>
              {quiz === null ? (
                <p className="text-center">Quiz không tồn tại.</p>
              ) : (
                <div>
                  <h1 className="font-bold text-2xl text-center">
                    {quiz?.title}
                  </h1>
                  <div className="flex gap-2 flex-wrap my-10">
                    <p className="flex-1 text-center bg-green-500 hover:bg-green-300 cursor-pointer p-2 text-white font-semibold" onClick={()=>navigate(`/flashcard/${id}`)}>
                    <FontAwesomeIcon icon={faBook} className="mr-2" />
                      Thẻ ghi nhớ
                    </p>
                    <p className="flex-1 text-center bg-yellow-500 hover:bg-yellow-300 cursor-pointer p-2 text-white font-semibold" onClick={()=>navigate(`/testquiz/${id}`)}>
                    <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
                      Kiểm tra
                    </p>
                  </div>
                  <p>
                    <span className="font-semibold">Thông tin về quiz:{" "}</span>
                    <span
                      dangerouslySetInnerHTML={{ __html: quiz.description }}
                    />
                  </p>
                  {/* Render other quiz details here */}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer ref={displayRef} />
    </div>
  );
}
