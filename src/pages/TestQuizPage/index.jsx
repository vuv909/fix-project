import React, { useEffect, useRef, useState } from "react";
import TestQuiz from "../../components/TestQuiz";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import restClient from "../../services/restClient";
import ViewQuestionInTest from "../../components/ViewQuestionInTest";
import LazyComponent from "../../components/LazyComponent";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import Footer from "../../components/Footer";

export default function TestQuizPage() {
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [fixedDivHeight, setFixedDivHeight] = useState(0);
  const fixedDivRef = useRef(null);
  const [quizDetail, setQuizDetail] = useState(null)

  useEffect(() => {
    if (fixedDivRef.current) {
      setFixedDivHeight(fixedDivRef.current.offsetHeight);
    }
  }, [fixedDivRef, loading]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const quizResponse = await restClient({
          url: `api/quizquestion/getallquizquestionbyquizidtest/${id}?size=30`,
          method: "GET",
        });

        const quizDetailResponse = await restClient({
          url: `api/quiz/getquizbyid/${id}`,
          method: "GET",
        });

        if (quizDetailResponse.data?.data) {
          setQuizDetail(quizDetailResponse.data.data);
        } else {
          setQuizDetail({});
        }

        if (Array.isArray(quizResponse.data?.data)) {
          setQuizData(quizResponse.data.data);
        } else {
          setQuizData([]);
        }
      } catch (e) {
        console.error("Error fetching quiz:", e);
        setQuizData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);
  return (
    <div>
      <div ref={fixedDivRef} className="fixed top-0 w-full z-10">
        <Header />
        <Menu />
      </div>

      <div style={{ paddingTop: `${fixedDivHeight}px` }}>
        <ViewQuestionInTest quizData={quizData} quizDetail={quizDetail}/>
      </div>

      <LazyComponent>
        <Footer />
      </LazyComponent>
    </div>
  );
}

// export default function TestQuizPage() {
//   const [quizData, setQuizData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const { id } = useParams();

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const quizResponse = await restClient({
//           url: `api/quizquestion/getallquizquestionbyquizidpractice/${id}`,
//           method: 'GET',
//         });
//         if (Array.isArray(quizResponse.data?.data)) {
//           setQuizData(quizResponse.data.data);
//         } else {
//           setQuizData([]);
//         }
//       } catch (e) {
//         console.error('Error fetching quiz:', e);
//         setQuizData([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [id]);

//   return (
//     <div>
//       {loading ? (
//         <div className='flex justify-center items-center h-screen'>
//           <Loading />
//         </div>
//       ) : (
//         <TestQuiz quizData={quizData} />
//       )}
//     </div>
//   );
// }
