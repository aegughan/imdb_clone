const baseUrl = process.env.NEXT_PUBLIC_API_URL;
export const getApi = async (path) => {
    return await fetch(`${baseUrl}${path}`).then((res) => {
        if (!res.ok) throw res.response.data;
        return res.json();
    });
};

export const postApi = async (path, data, method = "POST", isFormData = false) => {
    let headerData = {}
    if (!isFormData) {
        headerData = {
            "Content-Type": "application/json",
        }
    }
    return await fetch(`${baseUrl}${path}`, {
        method,
        headers: {
            ...headerData
        },
        body: isFormData ? data : JSON.stringify(data),
    }).then((res) => {
        if (!res.ok) throw res.response.data;
        return res.json();
    });
};
