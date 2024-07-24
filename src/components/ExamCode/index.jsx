import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import Loading from "../Loading";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import restClient from "../../services/restClient";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import AddExamCode from "../AddExamCode";
import AnswerExam from "../AnwserExam";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { ACCEPT, REJECT } from "../../utils";

export default function ExamCode({
  visibleExamCode,
  setVisibleExamCode,
  examCodeValue,
  setTitle,
  toast,
}) {
  const [visibleAddExamCode, setVisibleAddExamCode] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visibleExam, setVisibleExam] = useState(false);
  const [examValue, setExamValue] = useState({});
  const [visibleDelete, setVisibleDelete] = useState(false);

  useEffect(() => {
    fetchData();
  }, [examCodeValue]);

  const fetchData = () => {
    setLoading(true);

    restClient({
      url: `api/examcode/getallexamcodebyexamid/${examCodeValue?.id}`,
      method: "GET",
    })
      .then((res) => {
        setProducts(Array.isArray(res?.data?.data) ? res?.data?.data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setProducts([]);
        setLoading(false);
      });
  };

  const indexBodyTemplate = (data, options) => options.rowIndex + 1;

  const actionBodyTemplate = (rowData) => (
    <div style={{ display: "flex" }}>
      <Button
        icon="pi pi-pencil"
        className="text-blue-600 p-mr-2 shadow-none"
        onClick={() => {
          setUpdateValue(rowData);
          setVisibleUpdate(true);
        }}
      />
      <Button
        icon="pi pi-trash"
        className="text-red-600 shadow-none"
        onClick={() => {
          confirmDelete(rowData.id);
        }}
      />
    </div>
  );

  
  const deleteExamCode = async (id) => {
    console.log(id);
    await restClient({ url: `api/examcode/deleteexamcodebyid/${id}`, method: "DELETE" })
      .then((res) => {
        fetchData();
        ACCEPT(toast, "Xóa thành công");
        setVisibleDelete(false);
      })
      .catch((err) => {
        REJECT(toast, "Xảy ra lỗi khi xóa đề thi này");
      })
      .finally(() => {
        setVisibleDelete(false);
      });
  };


  const confirmDelete = (id) => {
    setVisibleDelete(true);
    confirmDialog({
      message: "Bạn có chắc chắn muốn xóa đề thi này?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      footer: (
        <>
          <Button
            label="Xóa"
            icon="pi pi-check"
            className="p-2 bg-blue-500 text-white"
            onClick={() => {
              deleteExamCode(id);
            }}
          />
        </>
      ),
    });
  };
  const anwserTemple = (rowData) => {
    return (
      <div style={{ display: "flex" }}>
        <Button
          label="Đáp án"
          className="bg-blue-600 text-white p-2 text-sm font-normal"
          onClick={() => {
            setExamValue(rowData);
            setVisibleExam(true);
          }}
        />
      </div>
    );
  };
  return (
    <>
 
      <Toast ref={toast} />
      <Dialog
        header={setTitle}
        visible={visibleExamCode}
        style={{ width: "90vw", height: "90vw" }}
        onHide={() => setVisibleExamCode(false)}
      >
        <AddExamCode
          visible={visibleAddExamCode}
          setVisibleAddExamCode={setVisibleAddExamCode}
          toast={toast}
          addExamCodeValue={examCodeValue?.id}
          fetchData={fetchData}
        />
        <AnswerExam
          visibleExam={visibleExam}
          setVisibleExam={setVisibleExam}
          examValue={examValue}
          toast={toast}
        />
        <div className="flex justify-end mb-3">
          <Button
            label="Thêm mới"
            icon="pi pi-plus-circle"
            className="bg-blue-600 text-white p-2 text-sm font-normal"
            onClick={() => setVisibleAddExamCode(true)}
          />
        </div>

        {loading ? (
          <Loading />
        ) : (
          <DataTable
            value={products}
            loading={loading}
            className="border-t-2"
            tableStyle={{ minHeight: "30rem" }}
            selection={selectedProduct}
            onSelectionChange={(e) => setSelectedProduct(e.value)}
            scrollable
            scrollHeight="32rem"
          >
            <Column
              field="#"
              header="#"
              body={indexBodyTemplate}
              className="border-b-2 border-t-2"
              style={{ width: "5%" }}
            />

            <Column
              field="code"
              header="Mã Đề"
              className="border-b-2 border-t-2"
              style={{ width: "15%" }}
            />
            <Column
              header="Đáp án"
              className="border-b-2 border-t-2"
              style={{ width: "15%" }}
              body={anwserTemple}
            />
            <Column
              header="Hoạt Động"
              className="border-b-2 border-t-2"
              body={actionBodyTemplate}
            />
          </DataTable>
        )}
      </Dialog>
    </>
  );
}
