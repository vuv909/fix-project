import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomTextInput from "../../shared/CustomTextInput";
import CustomDropdown from "../../shared/CustomDropdown";
import CustomEditor from "../../shared/CustomEditor";
import { Button } from "primereact/button";
import Loading from "../Loading";
import restClient from "../../services/restClient";
import { ACCEPT, REJECT, SUCCESS } from "../../utils";

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

export default function UpdateDocumentDialog({
  visibleUpdate,
  setVisibleUpdate,
  toast,
  updateValue,
  fetchData,
}) {
  const [initialValues, setInitialValues] = useState({
    title: "",
    grade: {},
    description: "",
    author: "",
    edition: null,
    publicationYear: null,
    bookCollection: {},
    typeBook: {},
  });
  const [gradeList, setGradeList] = useState([]);
  const [bookCollectionList, setBookCollectionList] = useState([]);
  const [typeBookList, setTypeBookList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGrades = async () => {
      setLoading(true);
      try {
        // Fetch grade data by
        const gradeAllResponse = await restClient({
          url: `api/grade/getallgrade`,
          method: "GET",
        });
        const listGrade = gradeAllResponse.data?.data || [];

        //fet all type book
        const allTypeBook = restClient({
          url: "api/enum/getallbooktype",
          method: "GET",
        });
        const selectedallTypeBook = allTypeBook.data?.data || [];

        //fetch all book collection
        const getAllBookCollection = restClient({
          url: "api/enum/getallbookcollection",
          method: "GET",
        });
        const selectedtAllBookCollection =
          getAllBookCollection.data?.data || [];

        // Fetch grade data by id
        const gradeResponse = await restClient({
          url: `api/grade/getgradebyid/${updateValue.gradeId}`,
          method: "GET",
        });
        const selectedGrade = gradeResponse.data?.data || [];

        //fetch booktype
        const booktypeResponse = await restClient({
          url: `api/enum/getallbooktype`,
          method: "GET",
        });

        const selectedBookTypeMap = (booktypeResponse.data?.data || []).map(
          (item) => ({
            title: item.name,
            idNumber: item.value,
          })
        );

        const selectedBookType = selectedBookTypeMap.find(
          (book) => book.title === updateValue.typeOfBook
        );

        //fetch bookcollection
        const bookCollectionResponse = await restClient({
          url: `api/enum/getallbookcollection`,
          method: "GET",
        });

        const selectedbookCollectionMap = (
          bookCollectionResponse.data?.data || []
        ).map((item) => ({
          title: item.name,
          idNumber: item.value,
        }));

        const selectedbookCollection = selectedbookCollectionMap.find(
          (book) => book.title === updateValue.bookCollection
        );
        console.log(selectedbookCollection);
        console.log(selectedBookType);

        setInitialValues({
          title: updateValue.title,
          description: updateValue.description,
          grade: selectedGrade || {},
          typeBook: selectedBookType || {},
          bookCollection: selectedbookCollection || {},
          author: updateValue.author,
          edition: updateValue.edition,
          publicationYear: updateValue.publicationYear,
        });

        setGradeList(listGrade);
        setBookCollectionList(selectedbookCollectionMap);
        setTypeBookList(selectedBookTypeMap);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    if (visibleUpdate) {
      fetchGrades();
    }
  }, [visibleUpdate, updateValue]);

  const onSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      const model = {
        id: updateValue.id,
        title: values.title,
        gradeId: values.grade.id,
        description: values.description,
        isActive: true,
        bookCollection: values.bookCollection.idNumber,
        author: values.author,
        publicationYear: values.publicationYear,
        edition: values.edition,
        typeOfBook: values.typeBook.idNumber,
      };
      await restClient({
        url: "api/document/updatedocument",
        method: "PUT",
        data: model,
      });
      SUCCESS(toast, "Cập nhật tài liệu thành công");
      fetchData();
    } catch (err) {
      REJECT(toast, err.message);
    } finally {
      setLoading(false);
      setVisibleUpdate(false);
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      header="Cập nhật tài liệu"
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
          enableReinitialize={true}
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
                  {/* <ErrorMessage name="description" component="div" /> */}
                </CustomEditor>
              </div>
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
                  disabled={formik.isSubmitting}
                >
                  Cập nhật
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </Dialog>
  );
}
