import React from "react";
import { Button } from "primereact/button";
import { useForm, Controller } from "react-hook-form";
import Header from "../../components/Header";
import { useLocation } from "react-router-dom";
import {  resetPassword } from "../../services/authenService";
import { InputText } from "primereact/inputtext";
function useQuery() {
  return new URLSearchParams(useLocation().search);
}
const index = () => {
  const query = useQuery();
  const token = query.get("token");
  const email = query.get("email");
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
  } = useForm();

  const onSubmit = async (data) => {
    const password = data.password
    try {
      await resetPassword( {token, email, password });
      alert("sucess")
    } catch (error) {
      alert("reject")
    }


  };

  return (
    <>
      <Header />

      <div className="flex h-screen">
        <div className="w-1/2">
          <div className="w-auto h-full">
          <img src="src/assets/OIG4.jpg" alt="" className="w-full h-full" />
          </div>
        </div>

        <div className="w-1/2  flex items-center justify-center ">
          <div className="w-1/2 h-min  ">
            <h1 className="text-left mb-4 font-bold text-black text-3xl">
              Nhập lại mật khẩu
            </h1>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label htmlFor="password" className="cursor-pointer">
                  <h4 className=" text-xl text-black font-medium">
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
                      className=" w-full h-10 text-black-800 border border-solid border-gray-600  pb-2 pl-1 rounded-md"
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
                  <h4 className=" text-xl text-black font-medium">
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
                      className=" w-full h-10 text-black-800 border border-solid border-gray-600  pb-2 pl-1 rounded-md"
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
                  label="Xác nhận "
                  type="submit"
                  severity="info"
                  className=" w-full px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default index;
