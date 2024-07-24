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
import { Dialog } from "primereact/dialog";
import "./index.css";
import Document from "../Document";
import classNames from "classnames";
import Topic from "../Topic";
import Lesson from "../Lesson";

export default function ManageDocument() {
  const [navIndex, setNavIndex] = useState(1);

  return (
    <div>
      {/* menubar */}
      <div className="flex justify-start border-b-2 mb-5 border-[#D1F7FF]">
        <h1
          className={classNames("p-5 cursor-pointer hover:bg-[#D1F7FF]", {
            "bg-[#D1F7FF] font-bold": navIndex === 1,
          })}
          onClick={() => setNavIndex(1)}
        >
          Tài liệu
        </h1>
        <h1
          className={classNames("p-5 cursor-pointer hover:bg-[#D1F7FF]", {
            "bg-[#D1F7FF] font-bold": navIndex === 2,
          })}
          onClick={() => setNavIndex(2)}
        >
          Chủ đề
        </h1>
        <h1
          className={classNames("p-5 cursor-pointer hover:bg-[#D1F7FF]", {
            "bg-[#D1F7FF] font-bold": navIndex === 3,
          })}
          onClick={() => setNavIndex(3)}
        >
          Bài học
        </h1>
      </div>
      {navIndex === 1 && <Document />}
      {navIndex === 2 && <Topic />}
      {navIndex === 3 && <Lesson />}
    </div>
  );
}
