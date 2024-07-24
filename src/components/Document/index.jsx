import React, { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ContextMenu } from "primereact/contextmenu";
import { Paginator } from "primereact/paginator";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { ProgressSpinner } from "primereact/progressspinner";
import AddDocumentDialog from "../AddDocumentDialog";
import UpdateDocumentDialog from "../UpdateDocumentDialog";
import { ACCEPT, REJECT, formatDate, removeVietnameseTones } from "../../utils";
import restClient from "../../services/restClient";
import Loading from "../Loading";
import "./index.css";
import debounce from "lodash.debounce";

export default function Document() {
  const toast = useRef(null);
  const dropDownRef1 = useRef(null);
  const dropDownRef2 = useRef(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const cm = useRef(null);
  const [visible, setVisible] = useState(false);
  const [updateValue, setUpdateValue] = useState({});
  const [visibleUpdate, setVisibleUpdate] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterClass, setFilterClass] = useState({});
  const [textSearch, setTextSearch] = useState("");
  const [gradeList, setGradeList] = useState([]);

  // Pagination
  const [first, setFirst] = useState(0);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  const [totalPage, setTotalPage] = useState(0);

  useEffect(() => {
    restClient({
      url: "api/grade/getallgrade",
      method: "GET",
    })
      .then((res) => {
        setGradeList(res?.data?.data);
      })
      .catch((err) => {
        setGradeList([]);
      });
  }, []);

  useEffect(() => {
    fetchData();
  }, [page, rows, textSearch, filterClass]);

  const pagination = (page, rows) => {
    setLoading(true);
    restClient({
      url: `api/document/searchbydocumentpagination?PageIndex=${page}&PageSize=${rows}&${
        filterClass?.id && `GradeId=${filterClass?.id}`
      }`,
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
  };

  const fetchData = () => {
    if (textSearch.trim()) {
      setLoading(true);
      restClient({
        url: `api/document/searchbydocumentpagination?Value=${textSearch}&PageIndex=${page}&PageSize=${rows}&${
          filterClass?.id && `GradeId=${filterClass?.id}`
        }`,
        method: "GET",
      })
        .then((res) => {
          const paginationData = JSON.parse(res.headers["x-pagination"]);
          setUpdateValue({});
          setTotalPage(paginationData.TotalPages);
          setProducts(Array.isArray(res.data.data) ? res.data.data : []);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
          setProducts([]);
        })
        .finally(() => setLoading(false));
    } else {
      pagination(page, rows);
    }
  };

  const onPageChange = (event) => {
    const { page, rows, first } = event;
    setRows(rows);
    setPage(page + 1);
    setFirst(first);
  };

  const indexBodyTemplate = (rowData, { rowIndex }) => {
    const index = (page - 1) * rows + (rowIndex + 1);
    return <span>{index}</span>;
  };

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
        onClick={() => confirmDelete(rowData.id)}
      />
    </div>
  );

  const confirmDelete = (id) => {
    setVisibleDelete(true);
    confirmDialog({
      message: "Bạn có chắc chắn muốn xóa tài liệu này?",
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
            onClick={() => setVisibleDelete(false)}
          />
          <Button
            label="Xóa"
            icon="pi pi-check"
            className="p-2 bg-blue-500 text-white"
            onClick={() => deleteDocument(id)}
          />
        </>
      ),
    });
  };

  const deleteDocument = (id) => {
    restClient({ url: `api/document/deletedocument/${id}`, method: "DELETE" })
      .then(() => {
        fetchData();
        ACCEPT(toast, "Xóa thành công");
      })
      .catch((err) => {
        REJECT(toast, "Xảy ra lỗi khi xóa tài liệu này");
      })
      .finally(() => setVisibleDelete(false));
  };

  const cities = [{ name: "Cấp 1" }, { name: "Cấp 2" }, { name: "Cấp 3" }];

  const handleSearch = (text) => {
    setFilterClass(text);
  };

  const handleSearchInput = debounce((text) => {
    setTextSearch(text);
  }, 300);

  return (
    <div>
      <Toast ref={toast} />
      <ConfirmDialog visible={visibleDelete} />
      <AddDocumentDialog
        visible={visible}
        setVisible={setVisible}
        toast={toast}
        fetchData={fetchData}
      />
      <UpdateDocumentDialog
        visibleUpdate={visibleUpdate}
        setVisibleUpdate={setVisibleUpdate}
        updateValue={updateValue}
        toast={toast}
        fetchData={fetchData}
      />
      <div>
        <div className="flex justify-between pt-1">
          <h1 className="font-bold text-3xl">Tài liệu</h1>
          <div>
            <Button
              label="Thêm mới"
              icon="pi pi-plus-circle"
              severity="info"
              className="bg-blue-600 text-white p-2 text-sm font-normal"
              onClick={() => setVisible(true)}
            />
          </div>
        </div>

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

            <div className="flex-1 flex flex-wrap gap-3 justify-end">
              <div className="border-2 rounded-md mt-4">
                <Dropdown
                  filter
                  ref={dropDownRef2}
                  value={filterClass}
                  onChange={(e) => handleSearch(e.value)}
                  options={gradeList}
                  optionLabel="title"
                  showClear
                  placeholder="Lớp"
                  className="w-full md:w-14rem shadow-none h-full"
                />
              </div>
            </div>
          </div>
          {loading ? (
            <Loading />
          ) : (
            <>
              <DataTable
                value={products}
                loading={loading}
                className="border-t-2"
                tableStyle={{ minHeight: "30rem" }}
                selection={selectedProduct}
                onSelectionChange={(e) => setSelectedProduct(e.value)}
                scrollable
                scrollHeight="30rem"
              >
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
                  style={{ minWidth: '12rem' }}
                  className="border-b-2 border-t-2"
                />
                <Column
                  field="gradeTitle"
                  header="Lớp"
                  style={{ minWidth: '12rem' }}
                  className="border-b-2 border-t-2"
                />
                <Column
                  field="bookCollection"
                  header="Bộ sưu tập sách"
                  style={{ minWidth: '12rem' }}
                  className="border-b-2 border-t-2"
                />
                <Column
                  field="typeOfBook"
                  header="Loại sách"
                  style={{ minWidth: '12rem' }}
                  className="border-b-2 border-t-2"
                />
                <Column
                  field="author"
                  header="Tác giả"
                  style={{ minWidth: '12rem' }}
                  className="border-b-2 border-t-2"
                />
                <Column
                  field="createdDate"
                  header="Ngày tạo"
                  style={{ minWidth: '12rem' }}
                  className="border-b-2 border-t-2"
                  body={(rowData) => formatDate(rowData.createdDate)}
                />
                <Column
                  field="lastModifiedDate"
                  header="Ngày cập nhật"
                  style={{ minWidth: '12rem' }}
                  className="border-b-2 border-t-2"
                  body={(rowData) => formatDate(rowData.lastModifiedDate)}
                />
                <Column
                  className="border-b-2 border-t-2"
                  body={actionBodyTemplate}
                />
              </DataTable>
              <Paginator
                first={first}
                rows={rows}
                rowsPerPageOptions={[10, 20, 30]}
                totalRecords={totalPage * rows} // Total records should be calculated based on total pages and rows per page
                onPageChange={onPageChange}
                className="custom-paginator mx-auto"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
