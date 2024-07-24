import restClient from "./restClient";

export const getDocumentByGradeId = async (id, setLoading, setDocumentList) => {
    setLoading(true);
    await restClient({
        url: `api/document/searchbydocumentpagination?PageSize=4&OrderBy=averageRating&IsAscending=false&GradeId=` + id,
        method: "GET",
    })
        .then((res) => {
            setDocumentList(res.data.data || []);
            setLoading(false);
        })
        .catch((err) => {
            setDocumentList([]);
            setLoading(false);
        });
}

export const getAllDocument = async (setLoading, setDocumentList) => {
    setLoading(true);
    await restClient({
        url: `api/document/getalldocument`,
        method: "GET",
    })
        .then((res) => {
            setDocumentList(res.data.data || []);
            setLoading(false);
        })
        .catch((err) => {
            setListClass([]);
            setDocumentList(false);
        });
}

export const getAllDocumentSortByAvg = async (setLoading, setDocumentList) => {
    setLoading(true);
    await restClient({
        url: `api/document/searchbydocumentpagination?PageSize=5&OrderBy=averageRating&IsAscending=false`,
        method: "GET",
    })
        .then((res) => {
            setDocumentList(res.data.data || []);
            setLoading(false);
        })
        .catch((err) => {
            setDocumentList([]);
            setLoading(false);
        });
}


export const getDocumentByTopicId = async (setLoading, setDocumentDetailArrayList, id) => {
    setLoading(true);
    await restClient({
        url: `api/index/getalltopicindex/`+id,
        method: "GET",
    })
        .then((res) => {
            setDocumentDetailArrayList(res.data.data || []);
            setLoading(false);
        })
        .catch((err) => {
            setDocumentDetailArrayList([]);
            setLoading(false);
        });
}