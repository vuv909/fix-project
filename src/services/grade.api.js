import restClient from "./restClient";

export const getAllGrade = async (setLoading,setListClass) => {
    setLoading(true);
    await restClient({
        url: `api/grade/getallgrade`,
        method: "GET",
    })
        .then((res) => {
            setListClass(res.data.data || []);
            setLoading(false);
        })
        .catch((err) => {
            setListClass([]);
            setLoading(false);
        });
}