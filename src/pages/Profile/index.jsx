import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "primereact/button";
import Header from "../../components/Header";
import { getUser, updateUser } from "../../services/profileService";
import { REJECT, SUCCESS } from "../../utils";
import { Toast } from "primereact/toast";
import Loading from "../../components/Loading";
const Index = () => {
  const toast = useRef(null);
  const [imageURL, setImageURL] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const id = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUser(id);
        if (response.data && response.data.data) {
          setLoading(true)
         
          const userData = response.data.data;
          setImageURL(userData.image);
          setValue("firstname", userData.firstName);
          setValue("lastname", userData.lastName);
          setValue("email", userData.email);
          if (userData.dob) {
            const dob = new Date(userData.dob);
            dob.setDate(dob.getDate() + 1);
            setValue("dob", dob.toISOString().split("T")[0]);
          }
          setValue("phoneNumber", userData.phoneNumber);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [id, setValue]);

  const onSubmit = async (data, e) => {
    e.preventDefault();
    const { firstname, lastname, email, dob, phoneNumber } = data;

    const formData = new FormData();
    formData.append("UserId", id);
    formData.append("Email", email);
    formData.append("FirstName", firstname);
    formData.append("LastName", lastname);
    formData.append("PhoneNumber", phoneNumber);
    formData.append("Dob", dob);
    formData.append("Image", imageFile);
    try {
      await updateUser(formData);
      SUCCESS(toast, "Cập Nhập Thông Tin Thành Công");
    } catch (error) {
      REJECT(toast, "Cập Nhật Thông Tin Thất Bại");
    }
  };

  const handleImageChange = (e, field) => {
    const file = e.target.files[0];
    const allowedTypes = ["image/jpeg", "image/png"];

    if (file && allowedTypes.includes(file.type)) {
      console.log("File hợp lệ:", file);
      setImageFile(file);
      setImageURL(URL.createObjectURL(file));
      field.onChange(file);

    } else {
      
      console.log("File không hợp lệ:", file);
      alert("Vui lòng chọn tệp JPG hoặc PNG.");
    }
  }

  return (
    <>
      <Header />
      <div className="min-w-screen min-h-screen flex justify-center items-center bg-gray-100 ">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-md rounded-lg p-20"
        >
          {!loading ? <Loading/> : (<>
            <h1 className="font-semibold text-3xl text-center mb-6  text-gray-800">
            Thông Tin Hồ Sơ
          </h1>
          <div className="flex">
            <div className="w-1/2 flex flex-col items-center">
              <label htmlFor="image" className="cursor-pointer mb-4">
                <img
                  src={imageURL ? imageURL : "src/assets/img/image.png"}
                  alt="Profile"
                  className="w-60 h-60 object-cover border-2 border-gray-300 rounded-full"
                />
              </label>
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <input
                    onChange={(e) => handleImageChange(e, field)}
                    type="file"
                    id="image"
                    hidden
                  />
                )}
              />
              <button
                type="button"
                onClick={() => document.getElementById("image").click()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none"
              >
                Cập nhật ảnh
              </button>
            </div>
            <div className="flex flex-col items-center my-4 mx-6">
              <div className="w-px h-full bg-gray-300"></div>
            </div>
            <div className="w-3/4 flex-grow">
              <div className="flex mb-4">
                <div className="w-1/2 mr-2">
                  <label
                    htmlFor="firstname"
                    className="block mb-2 text-lg font-medium text-gray-700"
                  >
                    Họ <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="firstname"
                    control={control}
                    rules={{ required: "Họ không được để trống" }}
                    render={({ field }) => (
                      <input
                        id="firstname"
                        type="text"
                        {...field}
                        value={field.value || ""}
                        className="w-full h-10 border border-gray-300 rounded-md px-3"
                        placeholder="Nhập họ"
                      />
                    )}
                  />
                  {errors.firstname && (
                    <span className="text-red-500 text-sm">
                      {errors.firstname.message}
                    </span>
                  )}
                </div>
                <div className="w-1/2 ml-2">
                  <label
                    htmlFor="lastname"
                    className="block mb-2 text-lg font-medium text-gray-700"
                  >
                    Tên <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="lastname"
                    control={control}
                    rules={{ required: "Tên không được để trống" }}
                    render={({ field }) => (
                      <input
                        id="lastname"
                        type="text"
                        {...field}
                        value={field.value || ""}
                        className="w-full h-10 border border-gray-300 rounded-md px-3"
                        placeholder="Nhập tên"
                      />
                    )}
                  />
                  {errors.lastname && (
                    <span className="text-red-500 text-sm">
                      {errors.lastname.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block mb-2 text-lg font-medium text-gray-700"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "Email không được để trống",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email không hợp lệ",
                    },
                  }}
                  render={({ field }) => (
                    <input
                      id="email"
                      type="text"
                      {...field}
                      value={field.value || ""}
                      className="w-full h-10 border border-gray-300 rounded-md px-3"
                      placeholder="Nhập email"
                      readOnly
                    />
                  )}
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <div className="flex mb-4">
                <div className="w-1/2 mr-2">
                  <label
                    htmlFor="dob"
                    className="block mb-2 text-lg font-medium text-gray-700"
                  >
                    Ngày sinh <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="dob"
                    control={control}
                    rules={{ required: "Cập nhật ngày sinh" }}
                    render={({ field }) => (
                      <input
                        id="dob"
                        type="date"
                        {...field}
                        value={field.value || ""}
                        className="w-full h-10 border border-gray-300 rounded-md px-3"
                        placeholder="Nhập ngày sinh"
                      />
                    )}
                  />
                  {errors.dob && (
                    <span className="text-red-500 text-sm">
                      {errors.dob.message}
                    </span>
                  )}
                </div>
                <div className="w-1/2 ml-2">
                  <label
                    htmlFor="phoneNumber"
                    className="block mb-2 text-lg font-medium text-gray-700"
                  >
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="phoneNumber"
                    control={control}
                    rules={{
                      required: "Vui lòng nhập số điện thoại",
                      pattern: {
                        value: /^0\d{9}$/,
                        message: "Số điện thoại không hợp lệ",
                      },
                    }}
                    render={({ field }) => (
                      <input
                        id="phoneNumber"
                        type="text"
                        {...field}
                        value={field.value || ""}
                        className="w-full h-10 border border-gray-300 rounded-md px-3"
                        placeholder="Nhập số điện thoại"
                      />
                    )}
                  />
                  {errors.phoneNumber && (
                    <span className="text-red-500 text-sm">
                      {errors.phoneNumber.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="w-1/3 px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                >
                  Cập Nhật
                </button>
              </div>
            </div>
          </div></>)}
          
          
        </form>
        <Toast ref={toast} />
      </div>
    </>
  );
};

export default Index;
