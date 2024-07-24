import restClient from "./restClient";

export function getExamCodeById(id) {
    return restClient({
      url: `api/examcode/getallexamcodebyexamid/${id}`,
      method: `GET`
    });
  }
  export function getExamById(id) {
    return restClient({
      url: `api/exam/getexambyid/${id}`,
      method: `GET`
    });
  }