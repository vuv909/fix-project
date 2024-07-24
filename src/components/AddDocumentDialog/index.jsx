import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomTextInput from "../../shared/CustomTextInput";
import CustomSelectInput from "../../shared/CustomSelectInput";
import CustomTextarea from "../../shared/CustomTextarea";
import "./index.css";
import { Button } from "primereact/button";
import CustomEditor from "../../shared/CustomEditor";
import { REJECT, SUCCESS } from "../../utils";
import restClient from "../../services/restClient";
import Loading from "../Loading";
import CustomDropdown from "../../shared/CustomDropdown";

const validationSchema = Yup.object({
  title: Yup.string().required("Tiêu đề không được bỏ trống"),
  author: Yup.string().required("Tác giả không được bỏ trống"),
  edition: Yup.number()
    .required("Phiên bản không được bỏ trống")
    .positive("Phiên bản phải lớn hơn 0")
    .integer("Phiên bản phải là số nguyên"),
  publicationYear: Yup.number()
    .required("Năm xuất bản không được bỏ trống")
    .positive("Năm xuất bản phải lớn hơn 0")
    .integer("Năm xuất bản phải là số nguyên"),
  bookCollection: Yup.object()
    .test("is-not-empty", "Không được để trống trường này", (value) => {
      return Object.keys(value).length !== 0; // Check if object is not empty
    })
    .required("Không bỏ trống trường này"),
  typeBook: Yup.object()
    .test("is-not-empty", "Không được để trống trường này", (value) => {
      return Object.keys(value).length !== 0; // Check if object is not empty
    })
    .required("Không bỏ trống trường này"),
  grade: Yup.object()
    .test("is-not-empty", "Không được để trống trường này", (value) => {
      return Object.keys(value).length !== 0; // Check if object is not empty
    })
    .required("Không bỏ trống trường này"),
  description: Yup.string().required("Mô tả không được bỏ trống"),
});

export default function AddDocumentDialog({
  visible,
  setVisible,
  toast,
  fetchData,
}) {
  const initialValues = {
    title: "",
    grade: {},
    description: "",
    author: "",
    edition: null,
    publicationYear: null,
    bookCollection: {},
    typeBook: {},
  };
  const [gradeList, setGradeList] = useState([]);
  const [bookCollectionList, setBookCollectionList] = useState([]);
  const [typeBookList, setTypeBookList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    restClient({ url: "api/grade/getallgrade", method: "GET" })
      .then((res) => {
        setGradeList(Array.isArray(res.data.data) ? res.data.data : []);
      })
      .catch((err) => {
        setGradeList([]);
      });
    restClient({ url: "api/enum/getallbooktype", method: "GET" })
      .then((res) => {
        // Transform 'name' to 'title' in each object
        const transformedData = res.data.data.map((item) => ({
          title: item.name,
          idNumber: item.value,
        }));
        setTypeBookList(Array.isArray(transformedData) ? transformedData : []);
      })
      .catch((err) => {
        setTypeBookList([]);
      });

    restClient({ url: "api/enum/getallbookcollection", method: "GET" })
      .then((res) => {
        // Transform 'name' to 'title' in each object
        const transformedData = res.data.data.map((item) => ({
          title: item.name,
          idNumber: item.value,
        }));
        setBookCollectionList(Array.isArray(transformedData) ? transformedData : []);
      })
      .catch((err) => {
        setBookCollectionList([]);
      });
  }, []);

  const onSubmit = (values) => {
    setLoading(true);
    // const model = { ...values, isActive: true };
    const model = {
      title: values.title,
      gradeId: values.grade.id,
      description: values.description,
      bookCollection: values.bookCollection.idNumber,
      author: values.author,
      publicationYear: values.publicationYear,
      edition: values.edition,
      typeOfBook: values.typeBook.idNumber,
      isActive: true,
    };
    restClient({
      url: "api/document/createdocument",
      method: "POST",
      data: model,
    })
      .then((res) => {
        SUCCESS(toast, "Thêm tài liệu thành công");
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

  return (
    <Dialog
      header="Thêm tài liệu"
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
              <CustomTextInput
                label="Tiêu đề"
                name="title"
                type="text"
                id="title"
              />

              <CustomDropdown
                title="Chọn lớp"
                label="Lớp"
                name="grade"
                id="grade"
                options={gradeList}
              />
              {/* // */}
              <CustomDropdown
                title="bộ sách"
                label="Bộ sách"
                name="bookCollection"
                id="bookCollection"
                options={bookCollectionList}
              />

              <CustomDropdown
                title="loại sách"
                label="Loại sách"
                name="typeBook"
                id="typeBook"
                options={typeBookList}
              />

              <CustomTextInput
                label="Tác giả"
                name="author"
                type="text"
                id="author"
              />

              <CustomTextInput
                label="Năm xuất bản"
                name="publicationYear"
                type="number"
                id="publicationYear"
              />

              <CustomTextInput
                label="Phiên bản"
                name="edition"
                type="number"
                id="edition"
              />

              {/* // */}

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
