import React, { useEffect, useRef, useState } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import CategoryOfClass from "../../components/CategoryOfClass";
import CustomCard from "../../components/CustomCard";
import { Paginator } from "primereact/paginator";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import "./index.css";
import { Dropdown } from "primereact/dropdown";
import { useSearchParams, useLocation } from "react-router-dom";
import debounce from "lodash.debounce";
import Loading from "../../components/Loading";
import restClient from "../../services/restClient";

export default function Search() {
  const footerRef = useRef(null);
  const fixedDivRef = useRef(null);
  const dropDownRef1 = useRef(null);
  const dropDownRef2 = useRef(null);
  const [fixedDivHeight, setFixedDivHeight] = useState(0);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [params, setParams] = useSearchParams();

  //document
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [classId, setClassId] = useState(Object.fromEntries(params.entries()).classId || "");
  const [textSearch, setTextSearch] = useState(Object.fromEntries(params.entries()).text || "");


  //pagination
  const [first, setFirst] = useState(0);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  const [totalPage, setTotalPage] = useState(0);

  const cities = [
    { name: "New York", code: "NY" },
    { name: "Rome", code: "RM" },
    { name: "London", code: "LDN" },
    { name: "Istanbul", code: "IST" },
    { name: "Paris", code: "PRS" },
  ];

  useEffect(() => {
    if (params) {
      const decodedText = decodeURIComponent(
        Object.fromEntries(params.entries()).text || ""
      );
      setTextSearch(decodedText);
      setClassId(Object.fromEntries(params.entries()).classId || "");
    }
  }, [params]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsFooterVisible(true);
          } else {
            setIsFooterVisible(false);
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (dropDownRef1.current) {
      setFixedDivHeight(dropDownRef1.current.offsetHeight);
    }
    if (dropDownRef2.current) {
      setFixedDivHeight(dropDownRef2.current.offsetHeight);
    }
  }, [dropDownRef1, dropDownRef2]);

  useEffect(() => {
    if (fixedDivRef.current) {
      setFixedDivHeight(fixedDivRef.current.offsetHeight);
    }
  }, [fixedDivRef]);

  const handleSearchClick = () => {
    const encodedText = encodeURIComponent(textSearch.trim());
    setParams({
      ...Object.fromEntries(params.entries()),
      text: encodedText || "",
    });
  };

  //pagination and search
  useEffect(() => {
    fetchData();
  }, [page, rows, textSearch, classId]);

  const fetchData = () => {
    let url = 'api/document/searchbydocumentpagination?';
    const params = new URLSearchParams();
  
    if (textSearch) {
      params.append('Value', decodeURIComponent(textSearch));
    }
  
    if (page) {
      params.append('PageIndex', page.toString());
    }
  
    if (rows) {
      params.append('PageSize', rows.toString());
    }
  
    if (classId) {
      params.append('GradeId', classId);
    }
  
    url += params.toString();
  
    setLoading(true);
    restClient({
      url,
      method: 'GET',
    })
      .then((res) => {
        const paginationData = JSON.parse(res.headers['x-pagination']);
        setTotalPage(paginationData.TotalPages);
        setProducts(Array.isArray(res.data.data) ? res.data.data : []);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  };
  

  const onPageChange = (event) => {
    const { page, rows, first } = event;
    setRows(rows);
    setPage(page + 1);
    setFirst(first);
  };

  return (
    <>
      <div className="min-h-screen">
        <div ref={fixedDivRef} className="fixed top-0 w-full z-10">
          <Header
            params={params}
            setParams={setParams}
            textSearchProps={textSearch}
            settextSearchProps={setTextSearch}
          />
          <Menu />
        </div>
        <div
          style={{ paddingTop: `${fixedDivHeight}px` }}
          className="flex gap-5"
        >
          <CategoryOfClass
            display={isFooterVisible}
            params={params}
            setParams={setParams}
          />
          <div className="flex-1 w-[98%] pt-5">
            <div className="m-4 mb-10 flex flex-wrap items-center">
              <div className="border-2 rounded-md p-2">
                <InputText
                  value={textSearch} // Bind value to local state
                  placeholder="Search"
                  className="flex-1 focus:outline-none w-36 focus:ring-0"
                  onChange={(e) => {
                    // setTextSearch(e.target.value)
                    setParams({...Object.fromEntries(params.entries()),text:encodeURIComponent(e.target.value)})
                  }} // Update textSearch state and params
                />
                <Button
                  icon="pi pi-search"
                  className="p-button-warning focus:outline-none focus:ring-0 flex-shrink-0 cursor-pointer"
                  onClick={handleSearchClick}
                />
              </div>

              <div className="flex-1 flex gap-3 justify-end">
                {/* <div className="border-2 rounded-md mt-4">
                  <Dropdown
                    filter
                    ref={dropDownRef1}
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.value)}
                    options={cities}
                    optionLabel="name"
                    showClear
                    placeholder="Thể loại"
                    className="w-full md:w-14rem shadow-none h-full"
                  />
                </div> */}
                <div className="border-2 rounded-md mt-4">
                  <Dropdown
                    filter
                    ref={dropDownRef2}
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.value)}
                    options={cities}
                    optionLabel="name"
                    showClear
                    placeholder="Tài liệu"
                    className="w-full md:w-14rem shadow-none h-full"
                  />
                </div>
              </div>
            </div>
            <div className="m-4">
              <h1>
                Có{" "}
                <span className="text-blue-700 underline">
                  {Array.isArray(products) && products.length}
                </span>{" "}
                kết quả tìm kiếm
              </h1>
            </div>

            {/* {loading ? (
              <Loading />
            ) : (
              <> */}
            <div className="flex flex-wrap justify-start">
            {products &&
              products?.map((p, index) => {
                return <CustomCard document={p} key={index}/>;
              })}
            </div>

            {Array.isArray(products) && products.length > 0　&& totalPage > 1  && (
              <Paginator
                first={first}
                rows={rows}
                totalRecords={totalPage}
                onPageChange={onPageChange}
                rowsPerPageOptions={[10, 20, 30]}
                className="custom-paginator mx-auto"
              />
            )}
            {/* </>
            )} */}
          </div>
        </div>
      </div>
      <Footer ref={footerRef} />
    </>
  );
}
