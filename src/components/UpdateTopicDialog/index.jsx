import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "primereact/button";
import CustomEditor from "../../shared/CustomEditor";
import restClient from "../../services/restClient";
import Loading from "../Loading";
import CustomTextarea from "../../shared/CustomTextarea";
import CustomTextInput from "../../shared/CustomTextInput";
import CustomDropdown from "../../shared/CustomDropdown";
import CustomDropdownInSearch from "../../shared/CustomDropdownInSearch";
import { REJECT, SUCCESS } from "../../utils";

const validationSchema = Yup.object({
  title: Yup.string().required("Tiêu đề không được bỏ trống"),
  objectives: Yup.string().required("Mục tiêu chủ đề không được bỏ trống"),
  description: Yup.string().required("Mô tả không được bỏ trống"),
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

const UpdateTopicDialog = ({
  visibleUpdate,
  setVisibleUpdate,
  toast,
  updateValue,
  fetchData,
}) => {
  const [documentList, setDocumentList] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isClear, setIsClear] = useState(false);
  const [initialValues, setInitialValues] = useState({
    title: "",
    objectives: "",
    description: "",
    document: {},
    grade: {},
  });

  useEffect(() => {
    const fetchDocumentsAndGrade = async () => {
      setLoading(true);
      try {
        //get one document
        const documentById = await restClient({
          url: `api/document/getdocumentbyid/${updateValue.documentId}`,
          method: "GET",
        });
        const selecteddocumentById = documentById.data?.data || {};

        // Fetch grade data by id
        const gradeResponse = await restClient({
          url: `api/grade/getgradebyid/${selecteddocumentById.gradeId}`,
          method: "GET",
        }); 
        const selectedGrade = gradeResponse.data?.data || [];

        // Fetch documents based on grade
        const documentResponse = await restClient({
          url: `api/document/getalldocumentbygrade/${selectedGrade.id}`,
          method: "GET",
        });
        const documents = documentResponse.data?.data || [];

        setInitialValues({
          title: updateValue.title,
          objectives: updateValue.objectives,
          description: updateValue.description,
          grade: selectedGrade || {},
          document: selecteddocumentById || {},
        });

        setDocumentList(documents);

        // Fetch grade data by
        const gradeAllResponse = await restClient({
          url: `api/grade/getallgrade`,
          method: "GET",
        }); 
        const listGrade = gradeAllResponse.data?.data || [];

        setGradeList(listGrade)

      } catch (err) {
        console.error("Error fetching documents:", err);
        setGradeList([]);
        setDocumentList([]);
      } finally {
        setLoading(false);
      }
    };

    if (visibleUpdate) {
      fetchDocumentsAndGrade();
    }
  }, [visibleUpdate, updateValue ]);

  const onSubmit = async (values) => {
    setLoading(true);
    const model = {
      id: updateValue.id,
      title: values.title,
      objectives: values.objectives,
      description: values.description,
      documentId: values.document.id,
      isActive: true,
    };

    restClient({
        url: "api/topic/updatetopic",
        method: "PUT",
        data: model,
      }).then((res)=>{
        SUCCESS(toast, "Cập nhật chủ đề thành công");
        fetchData();
        setVisibleUpdate(false);
      }).catch((error) => {
        REJECT(toast, error.message || "Cập nhật không thành công");
      }).finally(()=>{
        setLoading(false);
      })
   
  };

  const handleOnChangeGrade = async (e, helpers, setTouchedState, props) => {
    setIsClear(true)
    helpers.setValue(e.value);
    setTouchedState(true);
    if (props.onChange) {
      props.onChange(e); // Propagate the onChange event if provided
    }
    try {
      const documentResponse = await restClient({
        url: `api/document/getalldocumentbygrade/${e.target.value.id}`,
        method: "GET",
      });
      const documents = documentResponse.data?.data || [];
      setDocumentList(documents);
    } catch (error) {
      console.error("Error fetching documents by grade:", error);
      setDocumentList([]);
    }
  };

  return (
    <Dialog
      header="Cập nhật chủ đề"
      visible={visibleUpdate}
      style={{ width: "50vw" }}
      onHide={() => {
        if (visibleUpdate) {
          setVisibleUpdate(false);
        }
      }}
    >
      {loading ? (
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

              <CustomDropdown
                title="Chọn tài liệu"
                label="Tài liệu"
                name="document"
                id="document"
                clearTopic={isClear}
                setClearTopic={setIsClear}
                disabled={!documentList || documentList.length === 0}
                options={documentList}
              />

              <CustomTextarea
                label="Mục tiêu chủ đề"
                name="objectives"
                id="objectives"
              >
                <ErrorMessage name="objectives" component="div" />
              </CustomTextarea>

              <div>
                <CustomEditor
                  label="Thông tin chi tiết"
                  name="description"
                  id="description"
                >
                  <ErrorMessage name="description" component="div" />
                </CustomEditor>
              </div>

              <CustomTextInput
                label="Tiêu đề"
                name="title"
                type="text"
                id="title"
              />

              <div className="flex justify-end gap-2">
                <Button
                  className="p-2 bg-red-500 text-white"
                  type="button"
                  severity="danger"
                  onClick={() => setVisibleUpdate(false)}
                >
                  Hủy
                </Button>
                <Button className="p-2 bg-blue-500 text-white" type="submit">
                  Cập nhật
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </Dialog>
  );
};

export default UpdateTopicDialog;
