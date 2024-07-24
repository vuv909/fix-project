import { ProgressSpinner } from "primereact/progressspinner";
import React, { useEffect } from "react";

export default function LoadingScreen({ setLoading }) {
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <ProgressSpinner />
    </div>
  );
}
