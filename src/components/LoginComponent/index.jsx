import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { LoginSocialFacebook } from "reactjs-social-login";
import { loginByFacebook, loginByGoogle } from "../../services/authenService";
import "primeicons/primeicons.css";
import { useNavigate } from "react-router-dom";
import { decodeToken } from "../../utils";
import { useDispatch } from "react-redux";
import { addUser } from "../../redux/userr/userSlice";

const clientId =
  "1064675960403-r511aufechb2vs1enui9asqmv5npno05.apps.googleusercontent.com";

const Index = () => {
  const dispatch = useDispatch();
  const token = (response) => {
    localStorage.setItem("accessToken", response.data.data.accessToken);
    localStorage.setItem("refreshToken", response.data.data.refreshToken);
    localStorage.setItem("userId", response.data.data.userDto.id);
    localStorage.setItem("userEmail", response.data.data.userDto.email);
  };
  const navigate = useNavigate();
  const onSuccess = async (response) => {
    const idToken = response.credential;
    try {
      const responses = await loginByGoogle(idToken);
      handleTokenResponse(responses)
      token(responses);
      navigate("/");
    } catch (error) {
      alert("Login không thành công ");
    }
  };

  const handleTokenResponse = (responses) => {
    try {
      const decodedToken = decodeToken(responses?.data?.data?.accessToken);
      dispatch(addUser(decodedToken));
    } catch (error) {
      console.error('Error decoding or dispatching:', error.message);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const onFailure = (error) => {
    console.error("[Google Login Failed] Error:", error);
  };

  const onResolve = async (response) => {
    const accessToken = response.data.accessToken;
    console.log(accessToken);
    try {
      const response = await loginByFacebook(accessToken);
      token(response);
      navigate("/");
    } catch (error) {
      alert("Đ login đc");
    }

    console.log(
      "[Facebook Login Success] Response:",
      response.data.accessToken
    );
  };

  const onReject = (error) => {
    console.error("[Facebook Login Failed] Error:", error);
    // Handle login failure logic here (e.g., display error message)
  };

  return (
    <div className="flex justify-center">
      <GoogleOAuthProvider clientId={clientId}>
        <div className="mr-4">
          <GoogleLogin
            className="cursor-pointer"
            onSuccess={onSuccess}
            onError={onFailure}
            size={43}
          />
        </div>
      </GoogleOAuthProvider>
      <LoginSocialFacebook
        className="cursor-pointer"
        appId="466716385847516"
        onResolve={onResolve}
        onReject={onReject}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/2023_Facebook_icon.svg/2048px-2023_Facebook_icon.svg.png"
          alt="Facebook Login"
          style={{ width: "40px", height: "40px" }}
          className="cursor-pointer"
        />
      </LoginSocialFacebook>
    </div>
  );
};

export default Index;
