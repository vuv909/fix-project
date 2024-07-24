import React, { useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { loginWithRoleAdmin } from "../../services/authenService";
import { REJECT } from "../../utils";
import { Toast } from "primereact/toast";
import * as Yup from "yup";

// Define the validation schema with regex for password
const validationSchema = Yup.object().shape({
  email: Yup.string().email("Email không hợp lệ").required("Tài khoản là bắt buộc"),
  password: Yup.string()
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
      "Mật khẩu phải ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt"
    )
    .required("Mật khẩu là bắt buộc"),
});

export default function About() {
  const toast = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    // Reset errors
    setEmailError("");
    setPasswordError("");

    try {
      await validationSchema.validate({ email, password }, { abortEarly: false });
      await loginWithRoleAdmin(email, password);
      navigate("/dashboard");
    } catch (error) {
      if (error.name === "ValidationError") {
        // Show validation error below the input fields
        error.inner.forEach(err => {
          if (err.path === "email") {
            setEmailError(err.message);
          }
          if (err.path === "password") {
            setPasswordError(err.message);
          }
        });
      } else {
        REJECT(toast, "Sai tài khoản hoặc mật khẩu");
      }
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-medium text-gray-900">Quản Lý</h1>
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-gray-900 text-xl font-medium mb-2"
          >
            Tài Khoản <span className="text-red-500">*</span>
          </label>
          <InputText
            id="email"
            type="text"
            placeholder="Nhập tài khoản"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-gray-300 border-solid border rounded-md py-2 px-3"
          />
          {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
        </div>
        <br />

        <div>
          <label
            htmlFor="password"
            className="block text-gray-900 text-xl font-medium mb-2"
          >
            Mật Khẩu<span className="text-red-500">*</span>
          </label>
          <InputText
            id="password"
            type="password"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-gray-300 border-solid border rounded-md py-2 px-3"
          />
          {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
        </div>
        <br />
        <Button
          label="Đăng Nhập"
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white py-3 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        />
      </div>
      <Toast ref={toast} />
    </div>
  );
}
