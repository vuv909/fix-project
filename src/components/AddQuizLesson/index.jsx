import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomTextInput from "../../shared/CustomTextInput";
import CustomSelectInput from "../../shared/CustomSelectInput";
import CustomTextarea from "../../shared/CustomTextarea";
import { Button } from "primereact/button";
import CustomEditor from "../../shared/CustomEditor";
import { REJECT, SUCCESS } from "../../utils";
import restClient from "../../services/restClient";
import Loading from "../Loading";
import { Dropdown } from "primereact/dropdown";
import CustomDropdown from "../../shared/CustomDropdown";
import CustomDropdownInSearch from "../../shared/CustomDropdownInSearch";

const validationSchema = Yup.object({
  title: Yup.string().required("Tiêu đề không được bỏ trống"),
  description: Yup.string().required("Mô tả không được bỏ trống"),
  score: Yup.number()
    .required("Điểm không được bỏ trống và lớn hơn 0")
    .min(0, "Điểm phải lớn hơn hoặc bằng 0"),
  grade: Yup.object()
    .test("is-not-empty", "Không được để trống trường này", (value) => {
      return Object.keys(value).length !== 0; // Check if object is not empty
    })
    .required("Không bỏ trống trường này"),
  type: Yup.object()
    .test("is-not-empty", "Không được để trống trường này", (value) => {
      return Object.keys(value).length !== 0; // Check if object is not empty
    })
    .required("Không bỏ trống trường này"),
  document: Yup.object()
    .test("is-not-empty", "Không được để trống trường này", (value) => {
      return Object.keys(value).length !== 0; // Check if object is not empty
    })
    .required("Không bỏ trống trường này"),
  topic: Yup.object()
    .test("is-not-empty", "Không được để trống trường này", (value) => {
      return Object.keys(value).length !== 0; // Check if object is not empty
    })
    .required("Không bỏ trống trường này"),
  lesson: Yup.object().nullable(),
});

export default function AddQuizLesson({
  visible,
  setVisible,
  toast,
  fetchData,
}) {
  const [initialValues, setInitialValues] = useState({
    title: "",
    grade: {},
    description: "",
    document: {},
    score: null,
    topic: {},
    lesson: {},
    type: {},
  });
  const [documentList, setDocumentList] = useState([]);
  const [topicList, setListTopic] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gradeList, setListGrade] = useState([]);
  const [clearTopic, setClearTopic] = useState(false);
  const [clearGrade, setClearGrade] = useState(false);
  const [clearLesson, setClearLesson] = useState(false);
  const [lessonList, setLessonList] = useState([]);
  const [typeQuiz, setTypeQuiz] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all grades
        const gradeResponse = await restClient({
          url: `api/grade/getallgrade`,
          method: "GET",
        });
        setListGrade(gradeResponse?.data?.data || []);
  
        // Fetch type quizzes
        const typeQuizResponse = await restClient({
          url: `api/enum/gettypequiz`,
          method: "GET",
        });
        const transformedData = typeQuizResponse?.data?.data?.map(item => ({
          title: item?.name,
          id: item?.value,
        }));
        setTypeQuiz(transformedData);
      } catch (error) {
        // Handle errors for both requests
        console.error("Error fetching data:", error);
        setListGrade([]);
        setTypeQuiz([]);
      }
    };
  
    // Call the fetchData function when the component mounts (empty dependency array)
    fetchData();
  }, []);

  const onSubmit = (values) => {
    // {
    //     "title": "string",
    //     "description": "string",
    //     "score": 0,
    //     "isActive": true,
    //     "topicId": 0,
    //     "lessonId": 0
    //   }
    let model = {
      title: values?.title,
      type: values?.type?.id,
      description: values?.description,
      score: values?.score,
      topicId: values?.topic.id,
      isActive: true,
    };
    if (values?.lesson && values?.lesson.id) {
      model = {
        title: values?.title,
        type: values?.type?.id,
        description: values?.description,
        score: values?.score,
        topicId: values?.topic.id,
        lessonId: values?.lesson.id,
        isActive: true,
      };
    }
    console.log("model: " + model);
    restClient({
      url: "api/quiz/createquiz",
      method: "POST",
      data: model,
    })
      .then((res) => {
        SUCCESS(toast, "Thêm bài quiz thành công");
        fetchData();
        setLoading(false);
      })
      .catch((err) => {
        REJECT(toast, err.message);
        setLoading(false);
      })
      .finally(() => {
        setVisible(false);
      });
  };

  const handleOnChangeGrade = (e, helpers, setTouchedState, props) => {
    setClearGrade(true);
    setClearTopic(true);
    setClearLesson(true);
    setDocumentList([]);
    setListTopic([]);
    setLessonList([]);
    helpers.setValue(e.value);
    setTouchedState(true); // Set touched state to true when onChange is triggered
    if (props.onChange) {
      props.onChange(e); // Propagate the onChange event if provided
    }
    restClient({
      url: `api/document/getalldocumentbygrade/` + e.target.value.id,
      method: "GET",
    })
      .then((res) => {
        setDocumentList(res.data.data || []);
      })
      .catch((err) => {
        setDocumentList([]);
      });
  };

  const handleOnChangeDocument = (e, helpers, setTouchedState, props) => {
    setClearTopic(true);
    setClearLesson(true);
    setListTopic([]);
    setLessonList([]);
    if (!e.target.value || !e.target.value.id) {
      setListTopic([]);
      helpers.setValue({});
      setTouchedState(true); // Set touched state to true when onChange is triggered
      if (props.onChange) {
        props.onChange(e); // Propagate the onChange event if provided
      }
      return; // Exit early if e.target.value or e.target.value.id is undefined
    }

    helpers.setValue(e.value);
    setTouchedState(true); // Set touched state to true when onChange is triggered
    if (props.onChange) {
      props.onChange(e); // Propagate the onChange event if provided
    }

    restClient({
      url: `api/topic/getalltopicbydocument/` + e.target.value.id,
      method: "GET",
    })
      .then((res) => {
        setListTopic(res.data.data || []);
      })
      .catch((err) => {
        setListTopic([]);
      });
  };

  const handleOnChangeTopic = (e, helpers, setTouchedState, props) => {
    setClearLesson(true);
    setLessonList([]);
    if (!e.target.value || !e.target.value.id) {
      setLessonList([]);
      helpers.setValue({});
      setTouchedState(true); // Set touched state to true when onChange is triggered
      if (props.onChange) {
        props.onChange(e); // Propagate the onChange event if provided
      }
      return; // Exit early if e.target.value or e.target.value.id is undefined
    }

    helpers.setValue(e.value);
    setTouchedState(true); // Set touched state to true when onChange is triggered
    if (props.onChange) {
      props.onChange(e); // Propagate the onChange event if provided
    }

    restClient({
      url: `api/lesson/getalllessonbytopic/` + e.target.value.id,
      method: "GET",
    })
      .then((res) => {
        setLessonList(res.data.data || []);
      })
      .catch((err) => {
        setLessonList([]);
      });
  };

  return (
    <Dialog
      header="Thêm bài quiz"
      visible={visible}
      style={{ width: "50vw" }}
      onHide={() => {
        if (!visible) return;
        setVisible(false);
      }}
    >
      {loading === true ? (
        <Loading />
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {(formik) => (
            <Form>
              <CustomDropdownInSearch
                title="Chọn lớp"
                label="Lớp"
                name="grade"
                id="grade"
                isClear={true}
                handleOnChange={handleOnChangeGrade}
                options={gradeList}
              />

              <CustomDropdownInSearch
                title="Chọn tài liệu"
                label="Tài liệu"
                name="document"
                id="document"
                isClear={true}
                clearGrade={clearGrade}
                setClearGrade={setClearGrade}
                disabled={!documentList || documentList.length === 0} // Disable if documentList is empty or undefined
                handleOnChange={handleOnChangeDocument}
                options={documentList}
              />

              <CustomDropdownInSearch
                title="Chọn chủ đề"
                label="Chủ đề"
                name="topic"
                id="topic"
                isClear={true}
                touched={false}
                clearGrade={clearTopic}
                setClearGrade={setClearTopic}
                disabled={!topicList || topicList.length === 0}
                handleOnChange={handleOnChangeTopic}
                options={topicList}
              />

              <CustomDropdown
                title="Chọn bài học"
                label="Bài học"
                name="lesson"
                id="lesson"
                touched={false}
                isNotRequired={true}
                clearTopic={clearLesson}
                setClearTopic={setClearLesson}
                disabled={!lessonList || lessonList.length === 0}
                options={lessonList}
              />

              <CustomDropdown
                title="Thể loại"
                label="thể loại"
                name="type"
                id="type"
                options={typeQuiz}
              />

              <CustomTextInput
                label="Tiêu đề"
                name="title"
                type="text"
                id="title"
              />

              <CustomTextInput
                label="Điểm"
                name="score"
                type="number"
                id="score"
              />

              <div>
                <CustomEditor
                  label="Thông tin chi tiết"
                  name="description"
                  id="description"
                >
                  <ErrorMessage name="description" component="div" />
                </CustomEditor>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  className="p-2 bg-red-500 text-white"
                  type="button"
                  severity="danger"
                  onClick={() => setVisible(false)}
                >
                  Hủy
                </Button>
                <Button className="p-2 bg-blue-500 text-white" type="submit">
                  Thêm
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </Dialog>
  );
}
