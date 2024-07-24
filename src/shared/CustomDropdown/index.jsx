import React, { useEffect, useState } from "react";
import { useField } from "formik";
import { Dropdown } from "primereact/dropdown";
import classNames from "classnames";
import "./index.css";

const CustomDropdown = ({
  label,
  options,
  title,
  clearTopic,
  setClearTopic,
  touched,
  customTitle,
  ...props
}) => {
  const [field, meta, helpers] = useField(props);
  const [touchedState, setTouchedState] = useState(false); // State to manage touched state manually

  useEffect(() => {
    if (clearTopic) {
      handleClear();
      setClearTopic(false);
    }
  }, [clearTopic]);

  const handleOnChange = (e) => {
    console.log('====================================');
    console.log(e);
    console.log('====================================');
    helpers.setValue(e.value);
    setTouchedState(true); // Set touched state to true when onChange is triggered
    if (props.onChange) {
      props.onChange(e); // Propagate the onChange event if provided
    }
  };

  const handleClear = () => {
    helpers.setValue(null); // Clear the field value
    // setTouchedState(touched || true); // Set touched state to true after clearing
  };

  const handleBlur = () => {
    helpers.setTouched(true); // Manually set Formik touched state
    setTouchedState(true); // Set touched state to true on blur
  };

  return (
    <div className="mb-5 flex-1 ">
      <label htmlFor={props.id || props.name}>{label}{" "}{!props?.isNotRequired && (<span className="text-red-500">*</span>)}</label>
      <Dropdown
        {...field}
        {...props}
        options={options}
        onChange={handleOnChange}
        onBlur={handleBlur} // Handle onBlur to set touched state manually
        onClear={handleClear} // Handle onClear to reset the field value and set touched state
        optionLabel={customTitle || "title"}
        filter
        showClear
        placeholder={title}
        className={classNames("w-full shadow-none p-1 border", {
          "border-red-500": meta.error && (meta.touched || touchedState), // Check if meta.error and touchedState are true
          "border-gray-300": !meta.error || !(meta.touched || touchedState), // Check if meta.error or touchedState are false
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

export default CustomDropdown;

// import React from "react";
// import { useField } from "formik";
// import { Dropdown } from "primereact/dropdown";
// import classNames from "classnames";

// const CustomDropdown = ({ label, options, ...props }) => {
//   const [field, meta, helpers] = useField(props);

//   console.log('====================================');
//   console.log("meta.error && meta.touched",meta.error,meta.touched);
//   console.log('====================================');

//   const handleOnChange = (e) => {
//     helpers.setValue(e.value);
//     if (props.onChange) {
//       props.onChange(e); // Propagate the onChange event if provided
//     }
//   };

//   return (
//     <div className="mb-5 flex-1">
//       <label htmlFor={props.id || props.name}>{label}</label>
//         <Dropdown
//           {...field}
//           {...props}
//           options={options}
//           onChange={handleOnChange}
//           optionLabel="title"
//           filter
//           showClear
//           placeholder="Chọn tài liệu"
//           className={classNames(
//             "w-full shadow-none p-1 border",
//             { "border-red-500":  meta.error && meta.touched  },
//             { "border-gray-300": !( meta.error && meta.touched) }
//           )}
//         />
//       { meta.error && meta.touched && (
//         <div className="text-red-500">{meta.error}</div>
//       )}
//     </div>
//   );
// };

// export default CustomDropdown;
