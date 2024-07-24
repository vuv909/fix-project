import React from "react";
import { ProgressSpinner } from "primereact/progressspinner";

export default function Loading({ heightValue }) {
  return (
    <div
      className="flex justify-center items-center"
      style={{ height: heightValue || "200px" }}
    >
      <ProgressSpinner style={heightValue ? { height: '50px' } : {}} />
    </div>
  );
}
