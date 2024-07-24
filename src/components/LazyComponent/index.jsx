import React, { useEffect, useState, useRef } from "react";

const LazyComponent = ({ children }) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          } 
        });
      },
      {
        threshold: 0.5, 
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return isInView === true ? (
    <div ref={ref}>{children}</div>
  ) : (
    <div ref={ref}></div>
  );
};

export default LazyComponent;
