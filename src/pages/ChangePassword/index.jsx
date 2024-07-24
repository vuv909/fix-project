import { Button } from "primereact/button";
import React, { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import Header from "../../components/Header";
import { changePassword } from "../../services/profileService";
import { Toast } from "primereact/toast";
import { REJECT, SUCCESS } from "../../utils";
import { InputText } from "primereact/inputtext";

const index = () => {
  const toast = useRef(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm();
  const onSubmit = async (data) => {
    const { password, newPassword } = data;
  try {
    await changePassword({ email, password, newPassword });
 
      SUCCESS(toast, "Đổi mật khẩu thành công");
      setValue("password", "");
      setValue("newPassword", "");
      setValue("passwordAgain", "");
   
  } catch (error) {
    setValue("password", "");
    setValue("newPassword", "");
    setValue("passwordAgain", "");
    REJECT(toast, "Đổi mật khẩu không thành công");
  }
};
  return (
    <>
    <Header />
    <div className="min-h-screen flex justify-center items-center bg-gray-100 py-8">
      <div className="w-full max-w-md border border-gray-300 rounded-lg p-8 bg-white shadow-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <h1 className="text-center font-extrabold text-3xl text-gray-800">
            Đổi mật khẩu
          </h1>
          <div>
            <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-2">
              Mật khẩu cũ<span className="text-red-500">*</span>
            </label>
            <Controller
              name="password"
              control={control}
              defaultValue=""
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
                  className="w-full h-10 text-black-800 border border-gray-300 rounded-md px-3"
                  placeholder="Nhập mật khẩu"
                  {...field}
                />
              )}
            />
            {errors.password && (
              <span className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </span>
            )}
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-lg font-medium text-gray-700 mb-2">
              Mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <Controller
              name="newPassword"
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
                  id="newPassword"
                  type="password"
                  className="w-full h-10 text-black-800 border border-gray-300 rounded-md px-3"
                  placeholder="Nhập mật khẩu"
                  {...field}
                />
              )}
            />
            {errors.newPassword && (
              <span className="text-red-500 text-sm mt-1">
                {errors.newPassword.message}
              </span>
            )}
          </div>
          <div>
            <label htmlFor="passwordAgain" className="block text-lg font-medium text-gray-700 mb-2">
              Nhập lại mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <Controller
              name="passwordAgain"
              defaultValue=""
              control={control}
              rules={{
                required: "Mật khẩu không được để trống",
                validate: (value) =>
                  value === getValues("newPassword") ||
                  "Mật khẩu nhập lại không khớp",
              }}
              render={({ field }) => (
                <InputText
                  id="passwordAgain"
                  type="password"
                  className="w-full h-10 text-black-800 border border-gray-300 rounded-md px-3"
                  placeholder="Nhập mật khẩu"
                  {...field}
                />
              )}
            />
            {errors.passwordAgain && (
              <span className="text-red-500 text-sm mt-1">
                {errors.passwordAgain.message}
              </span>
            )}
          </div>
          <div>
            <Button
              label="Cập Nhật"
              type="submit"
              className="w-full px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            />
          </div>
        </form>
      </div>
      <Toast ref={toast} />
    </div>
  </>
  
  );
};

export default index;
