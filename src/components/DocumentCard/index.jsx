import React from 'react';
import { Rating } from 'primereact/rating';
import { useNavigate } from 'react-router-dom';

export default function DocumentCard({ document }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white border-2 rounded-lg flex-1 mb-3 cursor-pointer w-full md:w-1/2 lg:w-1/4 px-2" onClick={()=>navigate(`/document/${document?.id}`)}>
      <div className="flex flex-col h-full py-11">
        <div className="px-6 pb-4 flex-1">
          <h1 className="font-bold text-xl mb-2 overflow-hidden text-center text-ellipsis">{document?.title}</h1>
        </div>
        <div className="px-6 py-2 flex items-center justify-center">
          <Rating value={document?.averageRating} readOnly cancel={false} />
          <span className="ml-1">{document?.totalReviewer}</span>
        </div>
      </div>
    </div>
  );
}
