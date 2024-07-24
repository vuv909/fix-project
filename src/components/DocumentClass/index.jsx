import React, { useEffect, useState } from "react";
import "./index.css";
import restClient from "../../services/restClient";
import Loading from "../Loading";
import { useNavigate } from "react-router-dom";

export default function DocumentClass({ display }) {
  const navigate = useNavigate()
  const [listClast, setListClass] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    restClient({
      url: `api/grade/getallgrade`,
      method: "GET",
    })
      .then((res) => {
        setListClass(res.data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setListClass([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-[15%] bg-gray-100 border-r-2 flex flex-col gap-3 min-h-screen pt-5">
      {loading ? (
        <Loading />
      ) : (
        <div
          className={`fixed w-[15%] ${
            display
              ? "transition duration-200 ease-in-out opacity-0"
              : "transition duration-200 ease-in-out opacity-100"
          }`}
        >
          <h1 className="font-bold text-xl pt-2 pl-2">Danh mục các lớp</h1>
          <div className="overflow-y-auto h-[75vh] custom-scrollbar">
            {listClast &&
              listClast.map((clast, index) => (
                <div
                  key={index}
                  className="hover:bg-[#D1F7FF] p-2 cursor-pointer"
                  style={{ maxWidth: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                  onClick={() => navigate(`/search?classId=`+clast.id)}
                >
                  Bộ sách {clast?.title}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
