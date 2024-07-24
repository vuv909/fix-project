import restClient from "./restClient";

export function login({ email, password }) {
  return restClient({
    url: "api/user/login",
    method: "POST",
    data: {
      emailOrUserName: email,
      password: password,
    },
  });
}

export function loginByGoogle(data) {
  return restClient({
    url: `api/user/googlelogin`,
    method: `POST`,
    data: {
      idToken: data,
    },
  });
}
export function loginByFacebook(data) {
  return restClient({
    url: `api/user/facebooklogin`,
    method: `POST`,
    data: {
      accessToken: data,
    },
  });
}
export function forgotPassword(email) {
  return restClient({
    url: "api/user/forgotpassword",
    method: "POST",
    data: JSON.stringify(email),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function resetPassword({ token, email, password }) {
  return restClient({
    url: "api/user/resetpassword",
    method: "POST",
    data: {
      token: token,
      email: email,
      newPassword: password,
    },
  });
}

export function sendVerifyEmail(params) {
  return restClient({
    url: `api/user/sendverifyemail`,
    method: `GET`,
    params: {
      email: params,
    },
  });
}
export function verifyEmail(token) {
  return restClient({
    url: `api/user/verifyEmail`,
    method: `GET`,
    params: {
      token: token,
    },
  });
}

export function registerUser({
  email,
  username,
  firstname,
  lastname,
  password,
}) {
  return restClient({
    url: "api/user/registeruser",
    method: "POST",
    data: {
      email: email,
      userName: username,
      firstName: firstname,
      lastName: lastname,
      password: password,
      phoneNumber: "0987654321",
    },
  });
}
export function createUserGrade({ userId, gradeId }) {
  if (!Array.isArray(gradeId)) {
    gradeId = gradeId.split(",").map((id) => parseInt(id.trim(), 10));
  }
  return restClient({
    url: "api/usergrade/updaterangeusergrade",
    method: "POST",
    data: {
      userId: userId,
      gradeIds: gradeId,
    },
  });
}
export function loginWithRoleAdmin(email, password) {
  return restClient({
    url: `api/admin/login`,
    method: `POST`,
    data: {
      email: email,
      password: password
    },
  });
}
