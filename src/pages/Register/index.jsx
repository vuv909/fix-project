import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { useForm, Controller } from "react-hook-form";
import LoginComponent from "../../components/LoginComponent";
import Header from "../../components/Header";
import { useLocation, useNavigate } from "react-router-dom";
import {
  createUserGrade,
  registerUser,
  verifyEmail,
} from "../../services/authenService";
import { REJECT, SUCCESS } from "../../utils";
import { Toast } from "primereact/toast";
import Menu from "../../components/Menu";
import { MultiSelect } from "primereact/multiselect";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./index.css";
import { InputText } from "primereact/inputtext";


function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Index = () => {
  const [selectClass, setSelectClass] = useState([]);
  const toast = useRef(null);
  const query = useQuery();
  const token = query.get("token");
  const email = query.get("email");
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
    getValues,
    setError,
    clearErrors,
  } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await verifyEmail(token);

        console.log(response.data.isSucceeded);

        if (!response?.data?.isSucceeded) {
          navigate("/checkmail");
        }
      } catch (error) {
        console.error("Error verifying email:", error);
      }
    };
    fetchData();
  }, [token, navigate]);

  useEffect(() => {
    if (isSubmitted) {
      if (selectClass.length === 0) {
        setError("selectClass", {
          type: "manual",
          message: "Vui lòng chọn ít nhất một lớp",
        });
      } else {
        clearErrors("selectClass");
      }
    }
  }, [isSubmitted, selectClass, setError, clearErrors]);

  const classes = [
    { class: "3" },
    { class: "4" },
    { class: "5" },
    { class: "6" },
    { class: "7" },
    { class: "8" },
    { class: "9" },
    { class: "10" },
    { class: "11" },
    { class: "12" },
  ];

  const handleSelected = (e) => {
    if (e.value.length <= 3) {
      setSelectClass(e.value);
    }
  };

  const onSubmit = async (data) => {
    const { firstname, lastname, username, password } = data;
    const classValues = selectClass.map((item) => item.class);
    const gradeId = classValues.join(",");
    try {
      const response = await registerUser({
        email,
        username,
        firstname,
        lastname,
        password,
      });
      const userId = response?.data?.data?.id;
      await createUserGrade({ userId, gradeId });
      SUCCESS(toast, "Đăng kí thành công");
      // setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      REJECT(toast, "Không đăng kí được");
    }
  };

  return (
    <div>
      <Header />
      <Menu />
      <div className="flex h-screen">
        <div className="w-1/2">
          <div className="w-auto h-full">
            <img src="src/assets/OIG4.jpg" alt="" className="w-full h-full" />
          </div>
        </div>

        <div className="w-1/2 flex items-center justify-center">
          <div className="w-7/12">
            <h1 className="text-left mb-4 font-bold text-black text-3xl">
              Tạo tài khoản
            </h1>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex justify-between gap-5">
                <div className="mb-4 basis-1/2">
                  <label htmlFor="firstname" className="cursor-pointer">
                    <h4 className="text-xl text-black font-medium">
                      Họ <span className="text-red-500">*</span>
                    </h4>
                  </label>
                  <Controller
                    name="firstname"
                    defaultValue=""
                    control={control}
                    rules={{ required: "Họ không được để trống" }}
                    render={({ field }) => (
                      <InputText
                        id="firstname"
                        type="text"
                        className="w-full h-12 text-black-800 border border-solid  border-gray-500 pb-2 rounded-md"
                        placeholder="Nhập họ"
                        {...field}
                      />
                    )}
                  />
                  <br />
                  {errors.firstname && (
                    <span className="text-red-500 text-sm">
                      {errors.firstname.message}
                    </span>
                  )}
                </div>
                <div className="mb-4 basis-1/2">
                  <label htmlFor="lastname" className="cursor-pointer">
                    <h4 className="text-xl text-black font-medium">
                      Tên <span className="text-red-500">*</span>
                    </h4>
                  </label>
                  <Controller
                    name="lastname"
                    defaultValue=""
                    control={control}
                    rules={{ required: "Tên không được để trống" }}
                    render={({ field }) => (
                      <InputText
                        id="lastname"
                        type="text"
                        className="w-full h-12 text-black-800 border border-solid  border-gray-500 pb-2 rounded-md"
                        placeholder="Nhập Tên"
                        {...field}
                      />
                    )}
                  />
                  <br />
                  {errors.lastname && (
                    <span className="text-red-500 text-sm">
                      {errors.lastname.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-between gap-5">
                <div className="mb-4 w-full max-w-[calc(50%-0.5rem)]">
                  <label htmlFor="username" className="cursor-pointer">
                    <h4 className="text-xl text-black font-medium">
                      Tên tài khoản <span className="text-red-500">*</span>
                    </h4>
                  </label>
                  <Controller
                    name="username"
                    defaultValue=""
                    control={control}
                    rules={{ required: "Tên tài khoản không được để trống" }}
                    render={({ field }) => (
                      <InputText
                      id="username"
                      type="text"
                      className="w-full h-12 text-black-800 border border-solid  border-gray-500 pb-2 pl-1 rounded-md focus:border-blue-400"
                      placeholder="Nhập tên tài khoản"
                      {...field}
                    />
                    
                    )}
                  />
                  <br />
                  {errors.username && (
                    <span className="text-red-500 text-sm">
                      {errors.username.message}
                    </span>
                  )}
                </div>
                <div className="mb-4 w-full max-w-[calc(50%-0.5rem)]">
                  <label htmlFor="grade" className="cursor-pointer">
                    <h4 className="text-xl text-black font-medium">
                      Lớp <span className="text-red-500">*</span>
                    </h4>
                  </label>
                  <div className="card border border-gray-500 rounded-md flex justify-content-center">
                    <MultiSelect
                      value={selectClass}
                      onChange={handleSelected}
                      options={classes}
                      optionLabel="class"
                      placeholder="Chọn lớp"
                      maxSelectedLabels={12}
                      className="w-full"
                    />
                  </div>
                  {errors.selectClass && (
                    <span className="text-red-600 text-sm">
                      {errors.selectClass.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="cursor-pointer">
                  <h4 className="text-xl text-black font-medium">
                    Mật Khẩu <span className="text-red-500">*</span>
                  </h4>
                </label>
                <Controller
                  name="password"
                  defaultValue=""
                  control={control}
                  rules={{
                    required: "Mật khẩu không được để trống",
                    pattern: {
                      value:
                        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
                      message:
                        "Mật khẩu cần ít nhất 8 ký tự, bao gồm chữ cái đầu viết hoa, số và ký tự đặc biệt",
                    },
                  }}
                  render={({ field }) => (
                    <InputText
                      id="password"
                      type="password"
                      className="w-full h-12 text-black-800 border border-solid  border-gray-500 pb-1 pl-1 rounded-md"
                      placeholder="Nhập mật khẩu"
                      {...field}
                    />
                  )}
                />
                <br />
                {errors.password && (
                  <span className="text-red-500 text-sm">
                    {errors.password.message}
                  </span>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="passwordAgain" className="cursor-pointer">
                  <h4 className="text-xl text-black font-medium">
                    Nhập lại mật khẩu <span className="text-red-500">*</span>
                  </h4>
                </label>
                <Controller
                  name="passwordAgain"
                  defaultValue=""
                  control={control}
                  rules={{
                    required: "Mật khẩu không được để trống",
                    validate: (value) =>
                      value === getValues("password") ||
                      "Mật khẩu nhập lại không khớp",
                  }}
                  render={({ field }) => (
                    <InputText
                      id="passwordAgain"
                      type="password"
                      className="w-full h-12 text-black-800 border border-solid  border-gray-500 pb-2 pl-1 rounded-md"
                      placeholder="Nhập mật khẩu"
                      {...field}
                    />
                  )}
                />
                <br />
                {errors.passwordAgain && (
                  <span className="text-red-500 text-sm">
                    {errors.passwordAgain.message}
                  </span>
                )}
              </div>
              <div className="mb-4">
                <Button
                  label="Đăng Ký"
                  type="submit"
                  className="w-full px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                />
              </div>
            </form>

            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-500"></div>
              <span className="mx-4 text-gray-500">Hoặc đăng ký với</span>
              <div className="flex-grow border-t border-gray-500"></div>
            </div>
            <LoginComponent />
          </div>
        </div>
      </div>
      <Toast ref={toast} />
    </div>
  );
};

export default Index;
