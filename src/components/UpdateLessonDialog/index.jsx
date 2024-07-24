import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomTextInput from "../../shared/CustomTextInput";
import CustomDropdown from "../../shared/CustomDropdown";
import CustomEditor from "../../shared/CustomEditor";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import restClient from "../../services/restClient";
import Loading from "../Loading";
import { decodeIfNeeded, isBase64, REJECT, SUCCESS } from "../../utils";
import "./index.css";
import CustomDropdownInSearch from "../../shared/CustomDropdownInSearch";

export default function UpdateLessonDialog({
  visibleUpdate,
  setVisibleUpdate,
  toast,
  getData,
  modelUpdate,
}) {
  const [files, setFiles] = useState([]);
  const [topicList, setListTopic] = useState([]);
  const [gradeList, setListGrade] = useState([]);
  const [documentList, setListDocument] = useState([]);
  const [isLoadingAddUpdate, setIsLoadingAddUpdate] = useState(false);
  const [initialValuesReady, setInitialValuesReady] = useState(false);
  const [loading, setLoading] = useState(false);

  // Select input content type
  const [inputContent, setInputContent] = useState(!!modelUpdate.content); // Initialize based on modelUpdate.content

  const validationSchema = Yup.object({
    title: Yup.string().required("Tiêu đề không được bỏ trống"),
    ...(inputContent && {
      content: Yup.string().required("Mô tả không được bỏ trống"),
    }),
    topic: Yup.object()
      .test("is-not-empty", "Chủ đề không được bỏ trống", (value) => {
        return Object.keys(value).length !== 0;
      })
      .required("Chủ đề không được bỏ trống"),
    grade: Yup.object()
      .test("is-not-empty", "Không được để trống trường này", (value) => {
        return Object.keys(value).length !== 0; // Check if object is not empty
      })
      .required("Không bỏ trống trường này"),
    document: Yup.object()
      .test("is-not-empty", "Không được để trống trường này", (value) => {
        return Object.keys(value).length !== 0; // Check if object is not empty
      })
      .required("Không bỏ trống trường này"),
  });

  const [clearTopic, setClearTopic] = useState(false);
  const [clearGrade, setClearGrade] = useState(false);

  const [initialValues, setInitialValues] = useState({
    title: "",
    topic: {},
    ...(inputContent && {
      content: decodeIfNeeded(modelUpdate.content),
    }),
    document: {},
    grade: {},
  });

  const handleChangeInputType = (e) => {
    setInputContent(e.target.value === "true"); // Convert the selected value to a boolean
  };

  useEffect(() => {
    setInputContent(!!modelUpdate.content);
  }, [modelUpdate]);

  useEffect(() => {
    const fetchTopics = async () => {
      setLoading(true);
      try {
        const topicResponse = await restClient({
          url: `api/topic/gettopicbyid?id=${modelUpdate.topicId}`,
          method: "GET",
        });

        const selectedTopic = topicResponse.data?.data;

        const documentResponse = await restClient({
          url: `api/document/getdocumentbyid/${selectedTopic.documentId}`,
          method: "GET",
        });

        const selectedDocument = documentResponse.data?.data;

        const gradeResponse = await restClient({
          url: `api/grade/getgradebyid/${selectedDocument.gradeId}`,
          method: "GET",
        });

        const selectedGrade = gradeResponse.data?.data;

        const listGradeResponse = await restClient({
          url: `api/grade/getallgrade`,
          method: "GET",
        });

        const listGrade = listGradeResponse.data?.data;

        const listDocumentByIdResponse = await restClient({
          url: `api/document/getalldocumentbygrade/` + selectedGrade.id,
          method: "GET",
        });

        const listDocumentById = listDocumentByIdResponse.data?.data;

        const listTopicByDocuResponse = await restClient({
          url: `api/topic/getalltopicbydocument/` + selectedDocument.id,
          method: "GET",
        });

        const listTopicByDocu = listTopicByDocuResponse.data?.data;

        setListTopic(listTopicByDocu);
        setListDocument(listDocumentById);
        setListGrade(listGrade);

        console.log("decoded content::", decodeIfNeeded(modelUpdate.content));

        const updatedInitialValues = {
          title: modelUpdate.title,
          content: decodeIfNeeded(modelUpdate.content),
          topic: selectedTopic || {},
          grade: selectedGrade || {},
          document: selectedDocument || {},
        };

        setInitialValues(updatedInitialValues);
        setInitialValuesReady(true); // Data has been fetched and initial values are set
      } catch (err) {
        setInitialValues({});
      } finally {
        setLoading(false);
      }
    };

    if (visibleUpdate) {
      fetchTopics();
    }
  }, [visibleUpdate, modelUpdate]);

  const onSubmit = async (values, { setSubmitting }) => {
    setIsLoadingAddUpdate(true);

    const formData = new FormData();
    formData.append("Id", modelUpdate.id);
    formData.append("Title", values.title);
    formData.append("TopicId", values.topic.id); // Use topic.id for TopicId
    if (inputContent) {
      formData.append("Content", values.content);
    }
    formData.append("IsActive", false);

    if (!inputContent) {
      if (files.some((file) => file.size > 10485760)) {
        REJECT(toast, "Vui lòng chọn file nhỏ hơn hoặc bằng 10mb");
        return;
      }
      if (files) {
        files.forEach((file) => {
          formData.append("FilePath", file);
        });
      }
    } else if (inputContent) {
      formData.append("FilePath", null);
    }

    try {
      await restClient({
        url: "api/lesson/updatelesson",
        method: "PUT",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      SUCCESS(toast, "Cập nhật bài học thành công");

      // Reset form state and fetch new data
      setFiles([]);
      getData(); // Fetch updated data
    } catch (err) {
      REJECT(toast, "Cập nhật không thành công");
    } finally {
      setIsLoadingAddUpdate(false);
      setVisibleUpdate(false);
      setSubmitting(false);
    }
  };

  const onFileSelect = (e) => {
    setFiles(e.files);
  };

  const handleOnChangeGrade = (e, helpers, setTouchedState, props) => {
    setClearTopic(true);
    setClearGrade(true);
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
        setListDocument(res.data.data || []);
        setListTopic([]);
      })
      .catch((err) => {
        setListDocument([]);
        setListTopic([]);
      });
  };

  const handleOnChangeDocument = (e, helpers, setTouchedState, props) => {
    setClearTopic(true);
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

  return (
    <Dialog
      header="Cập nhật bài học"
      visible={visibleUpdate}
      style={{ width: "50vw" }}
      onHide={() => {
        setFiles([]);
        setVisibleUpdate(false);
        setInitialValuesReady(false); // Reset the readiness state when the dialog is closed
      }}
    >
      {isLoadingAddUpdate ? (
        <Loading />
      ) : (
        initialValuesReady && (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            enableReinitialize={true}
          >
            {({ isSubmitting }) => (
              <Form>
                <CustomDropdownInSearch
                  title="Chọn lớp"
                  label="Lớp"
                  name="grade"
                  id="grade"
                  isClear={false}
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

                <CustomDropdown
                  label="Chủ đề"
                  title="Chọn chủ đề"
                  name="topic"
                  id="topic"
                  clearTopic={clearTopic}
                  setClearTopic={setClearTopic}
                  disabled={!topicList || topicList.length === 0}
                  options={topicList}
                />

                <CustomTextInput
                  label="Tiêu đề"
                  name="title"
                  type="text"
                  id="title"
                />

                <div className="flex justify-between mb-1">
                  <h1>Nội dung bài học</h1>
                  <select
                    value={inputContent.toString()} // Ensure this matches with the state variable
                    onChange={handleChangeInputType} // Make sure handleChangeInputType is correctly defined
                    className="text-sm border border-gray-300 p-1 rounded-md"
                  >
                    <option value="true">Soạn bài</option>
                    <option value="false">Tải file lên</option>
                  </select>
                </div>

                {inputContent ? (
                  <div>
                    <CustomEditor name="content" id="content">
                      <ErrorMessage name="content" component="div" />
                    </CustomEditor>
                  </div>
                ) : (
                  <div>
                    <label htmlFor="fileUpload">Tải file lên</label>
                    <FileUpload
                      id="fileUpload"
                      name="files"
                      url={"/api/upload"}
                      accept=".docx, application/vnd.openxmlformats-officedocument.wordprocessingml.document, .pdf, application/pdf"
                      maxFileSize={10485760} // 10MB
                      emptyTemplate={
                        <p className="m-0">
                          Drag and drop files here to upload.
                        </p>
                      }
                      className="custom-file-upload mb-2"
                      onSelect={onFileSelect}
                    />
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button
                    className="p-2 bg-red-500 text-white"
                    type="button"
                    severity="danger"
                    onClick={() => setVisibleUpdate(false)}
                  >
                    Hủy
                  </Button>
                  <Button
                    className="p-2 bg-blue-500 text-white"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Cập nhật
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        )
      )}
    </Dialog>
  );
}
