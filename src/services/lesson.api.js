import restClient from "./restClient";

export const getLessonById = async (id,setLoading,setLesson) => {
    setLoading(true);
    await restClient({
        url: `api/lesson/getlessonbyid/${id}`,
        method: "GET",
    })
        .then((res) => {
            setLesson(res.data.data || {});
            setLoading(false);
        })
        .catch((err) => {
            setLesson({});
            setLoading(false);
        });
}

export const getTopicById = async (id,setLoading,setTopicList) => {
    setLoading(true);
    await restClient({
        url: `api/topic/gettopicbyid?id=${id}`,
        method: "GET",
    })
        .then((res) => {
            setTopicList(res.data.data || {});
            setLoading(false);
        })
        .catch((err) => {
            setTopicList({});
            setLoading(false);
        });
}

export const getDocumentList = async (id,setLoading,setDocumentList) => {
    setLoading(true);
    await restClient({
        url: `api/index/getalltopicindex/${id}`,
        method: "GET",
    })
        .then((res) => {
            setDocumentList(res.data.data || {});
            setLoading(false);
        })
        .catch((err) => {
            setDocumentList({});
            setLoading(false);
        });
}

export const getDocumentListByLessonId = async (id,setLoading,setDocumentList) => {
    setLoading(true);
    await restClient({
        url: `api/index/getalllessonindex/${id}`,
        method: "GET",
    })
        .then((res) => {
            setDocumentList(res.data.data || {});
            setLoading(false);
        })
        .catch((err) => {
            setDocumentList({});
            setLoading(false);
        });
}