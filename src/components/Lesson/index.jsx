import React, { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ContextMenu } from "primereact/contextmenu";
import { Paginator } from "primereact/paginator";
import { Toast } from "primereact/toast";
import { ProductService } from "../../services/ProductService";
import { Button } from "primereact/button";
import "./index.css";
import AddLessonDialog from "../AddLessonDialog";
import UpdateLessonDialog from "../UpdateLessonDialog";
import UpdateDocumentDialog from "../UpdateDocumentDialog";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import {
  ACCEPT,
  REJECT,
  decodeIfNeeded,
  formatDate,
  getTokenFromLocalStorage,
  removeVietnameseTones,
} from "../../utils";
import Loading from "../Loading";
import restClient from "../../services/restClient";
import { Link } from "react-router-dom";
import debounce from "lodash.debounce";
import { InputSwitch } from "primereact/inputswitch";
import { Tooltip } from "primereact/tooltip";
import { Dialog } from "primereact/dialog";
import { Editor } from "primereact/editor";

export default function Lesson() {
  const toast = useRef(null);
  const dropDownRef1 = useRef(null);
  const dropDownRef2 = useRef(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const cm = useRef(null);
  const [visible, setVisible] = useState(false);
  const [visibleUpdate, setVisibleUpdate] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modelUpdate, setModelUpdate] = useState({});
  const [textSearch, setTextSearch] = useState("");
  const [loadingDeleteMany, setLoadingDeleteMany] = useState(false);
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [content, setContent] = useState("");

  //pagination
  const [first, setFirst] = useState(0);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  const [totalPage, setTotalPage] = useState(0);

  useEffect(() => {
    fetchData(page, rows);
  }, [page, rows, textSearch]);

  const getData = () => {
    fetchData(page, rows);
  };

  const fetchData = (page, rows) => {
    if (textSearch.trim()) {
      setLoading(true);
      restClient({
        url: `api/lesson/searchbylessonpagination?Value=${textSearch}&PageIndex=${page}&PageSize=${rows}`,
        method: "GET",
      })
        .then((res) => {
          const paginationData = JSON.parse(res.headers["x-pagination"]);
          setTotalPage(paginationData.TotalPages);
          setProducts(Array.isArray(res.data.data) ? res.data.data : []);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
          setProducts([]);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(true);

      restClient({
        url: `api/lesson/getalllessonpagination?PageIndex=${page}&PageSize=${rows}`,
        method: "GET",
      })
        .then((res) => {
          const paginationData = JSON.parse(res.headers["x-pagination"]);
          setTotalPage(paginationData.TotalPages);
          setProducts(Array.isArray(res.data.data) ? res.data.data : []);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
          setProducts([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div style={{ display: "flex" }}>
        <Button
          icon="pi pi-pencil"
          className="text-blue-600 p-mr-2 shadow-none"
          onClick={() => {
            setModelUpdate(rowData);
            setVisibleUpdate(true);
          }}
        />
        <Button
          icon="pi pi-trash"
          className="text-red-600 shadow-none"
          onClick={() => {
            setVisibleDelete(true);
            confirm(rowData.id);
          }}
        />
      </div>
    );
  };

  const cities = [
    { name: "New York", code: "NY" },
    { name: "Rome", code: "RM" },
    { name: "London", code: "LDN" },
    { name: "Istanbul", code: "IST" },
    { name: "Paris", code: "PRS" },
  ];

  const onPageChange = (event) => {
    const { page, rows, first } = event;
    setPage(page + 1);
    setRows(rows);
    setFirst(first);
  };

  const indexBodyTemplate = (rowData, { rowIndex }) => {
    const index = (page - 1) * rows + (rowIndex + 1);
    return <span>{index}</span>;
  };
  const file = (rowData, { rowIndex }) => {
    return (
      <Link
        className="p-2 bg-blue-500 text-white rounded-md"
        to={`${rowData.urlDownload}`}
      >
        Tải về
      </Link>
    );
  };

  const changeStatusLesson = (value, id) => {
    restClient({
      url: "api/lesson/updatestatuslesson?id=" + id,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getTokenFromLocalStorage()}`,
      },
    })
      .then((res) => {
        ACCEPT(toast, "Thay đổi trạng thái thành công");
        getData();
      })
      .catch((err) => {
        REJECT(toast, "Lỗi khi thay đổi trạng thái");
      });
  };

  const status = (rowData, { rowIndex }) => {
    return (
      <InputSwitch
        checked={rowData.isActive}
        onChange={(e) => changeStatusLesson(e.value, rowData.id)}
        tooltip={
          rowData.isActive
            ? "Bài học này đã được duyệt"
            : "Bài học chưa được duyệt"
        }
      />
    );
  };

  // modal delete
  const confirm = (id) => {
    setVisibleDelete(true);
    confirmDialog({
      message: "Do you want to delete this record?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      footer: (
        <>
          <Button
            label="Hủy"
            icon="pi pi-times"
            className="p-2 bg-red-500 text-white mr-2"
            onClick={() => {
              setVisibleDelete(false);
              REJECT(toast);
            }}
          />
          <Button
            label="Xóa"
            icon="pi pi-check"
            className="p-2 bg-blue-500 text-white"
            onClick={() => {
              deleteLesson(id);
            }}
          />
        </>
      ),
    });
  };

  const confirmDeleteMany = () => {
    setVisibleDelete(true);
    confirmDialog({
      message: "Do you want to delete this record?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      footer: (
        <>
          <Button
            label="Hủy"
            icon="pi pi-times"
            className="p-2 bg-red-500 text-white mr-2"
            onClick={() => {
              setVisibleDelete(false);
              REJECT(toast);
            }}
          />
          <Button
            label="Xóa"
            icon="pi pi-check"
            className="p-2 bg-blue-500 text-white"
            onClick={handleDeleteMany}
          />
        </>
      ),
    });
  };

  const handleDeleteMany = () => {
    setLoadingDeleteMany(true);
    const arrayId = selectedProduct.map((p, index) => p.id);
    restClient({
      url: `api/lesson/deleterangelesson`,
      method: "DELETE",
      data: arrayId,
    })
      .then((res) => {
        ACCEPT(toast, "Xóa thành công");
        setSelectedProduct([]);
        getData();
      })
      .catch((err) => {
        REJECT(toast, "Xảy ra lỗi khi xóa");
      })
      .finally(() => {
        setLoadingDeleteMany(false);
        setVisibleDelete(false);
      });
  };

  const view = (rowData, { rowIndex }) => {
    return (
      <Button
        label="Chi tiết"
        icon="pi pi-info-circle"
        className="text-white p-2 shadow-none bg-blue-600 hover:bg-blue-400"
        onClick={() => handleOpenDialog(rowData?.content)}
      />
    );
  };

  const handleOpenDialog = (content) => {
    setContent(content);
    setVisibleDialog(true);
  };

  const deleteLesson = (id) => {
    restClient({ url: `api/lesson/deletelesson/${id}`, method: "DELETE" })
      .then((res) => {
        getData();
        ACCEPT(toast, "Xóa thành công");
      })
      .catch((err) => {
        REJECT(toast, "Xảy ra lỗi khi xóa tài liệu này");
      })
      .finally(() => {
        setVisibleDelete(false);
      });
  };

  const handleSearchInput = debounce((text) => {
    setTextSearch(text);
  }, 300);

  return (
    <div>
      <Toast ref={toast} />
      <Dialog
        header="Nội dung chi tiết"
        visible={visibleDialog}
        style={{ width: "50vw" }}
        onHide={() => {
          if (!visibleDialog) return;
          setVisibleDialog(false);
        }}
      >
        <Editor
          value={decodeIfNeeded(content)}
          readOnly={true}
          headerTemplate={<></>}
          className="custom-editor-class"
        />
      </Dialog>
      <ConfirmDialog visible={visibleDelete} />
      <AddLessonDialog
        visible={visible}
        setVisible={setVisible}
        toast={toast}
        getData={getData}
      />
      <UpdateLessonDialog
        visibleUpdate={visibleUpdate}
        setVisibleUpdate={setVisibleUpdate}
        toast={toast}
        getData={getData}
        modelUpdate={modelUpdate}
      />
      <div>
        <div className="flex justify-between pt-1">
          <h1 className="font-bold text-3xl">Bài học</h1>
          <div>
            <Button
              label="Thêm mới"
              icon="pi pi-plus-circle"
              severity="info"
              className="bg-blue-600 text-white p-2 text-sm font-normal"
              onClick={() => setVisible(true)}
            />
            <Button
              label="Xóa"
              icon="pi pi-trash"
              severity="danger"
              disabled={!selectedProduct || selectedProduct.length === 0}
              className="bg-red-600 text-white p-2 text-sm font-normal ml-3"
              onClick={confirmDeleteMany}
            />
          </div>
        </div>

        {/* data */}
        <div className="border-2 rounded-md mt-2">
          <div className="mb-10 flex flex-wrap items-center p-2">
            <div className="border-2 rounded-md p-2">
              <InputText
                onChange={(e) => {
                  handleSearchInput(removeVietnameseTones(e.target.value));
                }}
                placeholder="Search"
                className="flex-1 focus:outline-none w-36 focus:ring-0"
              />
              <Button
                icon="pi pi-search"
                className="p-button-warning focus:outline-none focus:ring-0 flex-shrink-0"
              />
            </div>

            {/* <div className="flex-1 flex flex-wrap gap-3 justify-end">
              <div className="border-2 rounded-md mt-4">
                <Dropdown
                  filter
                  ref={dropDownRef2}
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.value)}
                  options={cities}
                  optionLabel="name"
                  showClear
                  placeholder="Lớp"
                  className="w-full md:w-14rem shadow-none h-full"
                />
              </div>
              <div className="border-2 rounded-md mt-4">
                <Dropdown
                  filter
                  ref={dropDownRef2}
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.value)}
                  options={cities}
                  optionLabel="name"
                  showClear
                  placeholder="Bộ sách"
                  className="w-full md:w-14rem shadow-none h-full"
                />
              </div>
              <div className="border-2 rounded-md mt-4">
                <Dropdown
                  filter
                  ref={dropDownRef2}
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.value)}
                  options={cities}
                  optionLabel="name"
                  showClear
                  placeholder="Chủ đề"
                  className="w-full md:w-14rem shadow-none h-full"
                />
              </div>
            </div> */}
          </div>
          {loading ? (
            <Loading />
          ) : (
            <DataTable
              value={products}
              onContextMenu={(e) => cm.current.show(e.originalEvent)}
              selection={selectedProduct}
              onSelectionChange={(e) => setSelectedProduct(e.value)}
              className="border-t-2"
              tableStyle={{ minHeight: "30rem" }}
              scrollable
              scrollHeight="30rem"
            >
              <Column
                selectionMode="multiple"
                headerStyle={{ width: "3rem" }}
                className="border-b-2 border-t-2 custom-checkbox-column"
              ></Column>
              <Column
                field="#"
                header="#"
                body={indexBodyTemplate}
                className="border-b-2 border-t-2"
                style={{ minWidth: '5rem' }}
              />

              <Column
                field="title"
                header="Tiêu đề"
                className="border-b-2 border-t-2"
                style={{ minWidth: '12rem' }}
              ></Column>
              <Column
                field="topicTitle"
                header="Chủ đề"
                className="border-b-2 border-t-2"
                style={{ minWidth: '12rem' }}
              ></Column>
              <Column
                header="File tài liệu"
                className="border-b-2 border-t-2"
                body={file}
                style={{ minWidth: '12rem' }}
              ></Column>
              <Column
                header="Trạng thái"
                className="border-b-2 border-t-2"
                body={status}
                style={{ minWidth: '10rem' }}
              ></Column>
              <Column
                field="createdDate"
                header="Ngày tạo"
                body={(rowData) => formatDate(rowData.createdDate)}
                className="border-b-2 border-t-2"
                style={{ minWidth: '20rem' }}
              ></Column>
              <Column
                field="lastModifiedDate"
                header="Ngày cập nhật"
                body={(rowData) => formatDate(rowData.lastModifiedDate)}
                className="border-b-2 border-t-2"
                style={{ minWidth: '20rem' }}
              ></Column>
              <Column
                field="info"
                header=""
                style={{ minWidth: '12rem' }}
                body={view}
                className="border-b-2 border-t-2"
              ></Column>
              <Column
                className="border-b-2 border-t-2"
                body={actionBodyTemplate}
              />
            </DataTable>
          )}
          <Paginator
            first={first}
            rows={rows}
            rowsPerPageOptions={[10, 20, 30]}
            totalRecords={totalPage * rows}
            onPageChange={onPageChange}
            className="custom-paginator mx-auto"
          />
        </div>
      </div>
    </div>
  );
}
