import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomTextInput from "../../shared/CustomTextInput";
import CustomEditor from "../../shared/CustomEditor";
import { Button } from "primereact/button";
import Loading from "../Loading";
import {
  getProvinceByName,
  getTypeByCode,
  REJECT,
  SUCCESS,
  TYPE,
} from "../../utils";
import axios from "axios";
import { Dropdown } from "primereact/dropdown";
import { FileUpload } from "primereact/fileupload";
import CustomDropdown from "../../shared/CustomDropdown";
import restClient from "../../services/restClient";
import { province } from "../../services/province";

const validationSchema = Yup.object({
  type: Yup.object()
    .test("is-not-empty", "Không được để trống trường này", (value) => {
      return Object.keys(value).length !== 0;
    })
    .required("Không bỏ trống trường này"),
  title: Yup.string().required("Tiêu đề không được bỏ trống"),
  description: Yup.string().required("Mô tả không được bỏ trống"),
  province: Yup.object()
    .test("is-not-empty", "Không được để trống trường này", (value) => {
      return Object.keys(value).length !== 0;
    })
    .required("Không bỏ trống trường này"),
  year: Yup.number()
    .required("Năm không được bỏ trống")
    .min(1900, "Năm phải lớn hơn 1900")
    .integer("Năm phải là số nguyên")
    .test("len", "Sai định dạng năm", (val) => val.toString().length === 4),
  numberQuestion: Yup.number().required("Không được bỏ trống"),
});

export default function UpdateExam({
  visibleUpdate,
  setVisibleUpdate,
  updateValue,
  toast,
  fetchData,
}) {
  const [files, setFiles] = useState([]);
  const [fileSolution, setFileSolution] = useState([]);
  const [provinceList, setProvinceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState(updateValue.type);
  const [initialValues, setInitialValues] = useState({
    type: {},
    title: "",
    province: {},
    description: "",
    year: "",
    numberQuestion: "",
  });

  
  useEffect(() => {
    if (province?.data && updateValue) {
      setProvinceList(province.data);
      setInitialValues(() => ({
        type: getTypeByCode(updateValue.type),
        title: updateValue.title,
        province: getProvinceByName(updateValue.province),
        description: updateValue.description,
        year: updateValue.year,
        numberQuestion: updateValue.numberQuestion,
      }));
    }
  }, [province, updateValue]);
  const onSubmit = async (values) => {
    console.log("====================================");
    console.log(values);
    console.log("====================================");
    setLoading(true);
   
    const tag = ["1", "2", "3"];
    const formData = new FormData();
    formData.append("Id", updateValue.id);
    formData.append("Type", values.type.code);
    formData.append("Title", values.title);
    formData.append("Province", values.province.name);
    formData.append("Description", values.description);
    formData.append("NumberQuestion", values.numberQuestion);
    formData.append("Year", values.year);
    formData.append("IsActive", true);
    tag.forEach((item, index) => {
      formData.append(`tagValues[${index}]`, item);
    });
    formData.append("ExamEssayFileUpload", files);
    formData.append("ExamSolutionFileUpload", fileSolution);

    try {
      const response = await restClient({
        url: "api/exam/updateexam",
        method: "PUT",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      SUCCESS(toast, "Thêm đề thi thành công");
      fetchData(); // Update the exam list
    } catch (error) {
      console.error("Error adding exam:", error);
      REJECT(toast, error.message);
    } finally {
      setLoading(false);
      setVisibleUpdate(false);
    }
  };

  const onFileSelect = (e) => {
    setFiles(e.files);
  };
  const onFileSolutionSelect = (e) => {
    setFileSolution(e.files);
  };
  console.log(type);
  return (
    <Dialog
      header="Sửa Đề Thi"
      visible={visibleUpdate}
      style={{ width: "50vw" }}
      onHide={() => setVisibleUpdate(false)}
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
              <CustomTextInput
                label="Tiêu đề"
                id="title"
                name="title"
                type="text"
              />

              <CustomDropdown
                title={updateValue.type ? updateValue.type : " Chọn Loại"}
                label="Loại"
                customTitle="name"
                id="type"
                name="type"
                options={TYPE}
                onChange={(e) => setType(e.value.code)}
                disabled={true}
              />
              <CustomDropdown
                title={updateValue.province ? updateValue.province : "Tỉnh"}
                label="Tỉnh"
                customTitle="name"
                id="province"
                name="province"
                options={provinceList}
              />

              <CustomTextInput
                label="Năm"
                id="year"
                name="year"
                type="number"
              />

              <CustomTextInput
                label="Số lượng câu hỏi"
                id="numberQuestion"
                name="numberQuestion"
                type="number"
              />

              <CustomEditor
                label="Thông tin chi tiết"
                id="description"
                name="description"
              >
                <ErrorMessage name="description" component="div" />
              </CustomEditor>

              {updateValue.type === 1 && (
                <>
                  <h1>File Đề Bài</h1>
                  <FileUpload
                    name="demo[]"
                    url={"/api/upload"}
                    accept=".pdf, application/pdf"
                    maxFileSize={10485760} // 10MB
                    emptyTemplate={
                      <p className="m-0">Drag and drop files here to upload.</p>
                    }
                    className="custom-file-upload mb-2"
                    onSelect={onFileSelect}
                  />
                  <h1>File Đề Lời Giải</h1>
                  <FileUpload
                    name="demo[]"
                    url={"/api/upload"}
                    accept=".pdf, application/pdf"
                    maxFileSize={10485760} // 10MB
                    emptyTemplate={
                      <p className="m-0">Drag and drop files here to upload.</p>
                    }
                    className="custom-file-upload mb-2"
                    onSelect={onFileSolutionSelect}
                  />
                </>
              )}
              <div className="flex justify-end gap-2">
                <Button
                  className="p-2 bg-red-500 text-white"
                  type="button"
                  onClick={() => setVisibleUpdate(false)}
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
