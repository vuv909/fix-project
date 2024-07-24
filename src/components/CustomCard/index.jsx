import React from "react";
import { useNavigate } from "react-router-dom";
import { Rating } from "primereact/rating";

const CustomCard = ({ document }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/2 px-2 mb-4">
      <div
        className="overflow-hidden shadow-lg bg-white border rounded-lg border-gray-300 p-6 cursor-pointer"
        onClick={() => navigate(`/document/${document?.id}`)}
      >
        <div>
          <p className="text-black hover:text-gray-500 text-2xl h-10 overflow-hidden text-ellipsis">
            {document?.title}
          </p>
        </div>
        <div className="flex items-center mt-3">
          <Rating value={document?.averageRating} readOnly cancel={false} className="custom-rating" />
          <span className="ml-1 text-gray-600">{document?.totalReviewer}</span>
        </div>
      </div>
    </div>
  );
};

export default CustomCard;
