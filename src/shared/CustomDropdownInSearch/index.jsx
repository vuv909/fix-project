import React, { useEffect, useState } from "react";
import { useField } from "formik";
import { Dropdown } from "primereact/dropdown";
import classNames from "classnames";
import "./index.css";

const CustomDropdownInSearch = ({
  label,
  options,
  isClear,
  clearGrade,
  setClearGrade,
  handleOnChange,
  title,
  ...props
}) => {
  const [field, meta, helpers] = useField(props);
  const [touchedState, setTouchedState] = useState(props?.isTouched || false); // State to manage touched state manually

  useEffect(() => {
    if (clearGrade) {
      handleClear();
      setClearGrade(false);
    }
  }, [clearGrade]);

  const handleBlur = () => {
    helpers.setTouched(true); // Manually set Formik touched state
    setTouchedState(true); // Set touched state to true on blur
  };

  const handleClear = () => {
    helpers.setValue(null); // Clear the field value
    // setTouchedState(true); // Set touched state to true after clearing 
  };

  return (
    <div className="mb-5 flex-1">
      <label htmlFor={props.id || props.name}>{label}{" "}{!props?.isNotRequired && (<span className="text-red-500">*</span>)}</label>
      <Dropdown
        {...field}
        {...props}
        options={options}
        onChange={(e) => {
          handleOnChange(e, helpers, setTouchedState, props);
        }}
        onBlur={handleBlur} // Handle onBlur to set touched state manually
        showClear={isClear}
        onClear={handleClear}
        optionLabel="title"
        filter
        placeholder={title}
        className={classNames("w-full shadow-none p-1 border", {
          "border-red-500": meta.error && (meta.touched || touchedState),
          "border-gray-300": !meta.error || !(meta.touched || touchedState),
        })}
      />
      {meta.error &&
        (meta.touched || touchedState) && (
          <div className="text-red-500">{meta.error}</div>
        )
      }
    </div>
  );
};

export default CustomDropdownInSearch;
