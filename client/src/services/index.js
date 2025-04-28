const baseUrl = process.env.NEXT_PUBLIC_API_URL;
export const getApi = async (path, isTokenRequired = true) => {
    const token = localStorage.getItem("userToken")
    const headerData = {}
    if (isTokenRequired) {
        headerData["Authorization"] = `Bearer ${token}`;
    }
    try {
        const response = await fetch(`${baseUrl}${path}`, {
            headers: {
                ...headerData
            },
        });
        const responseData = await response.json();
        if (!response.ok) {
            throw responseData
        }
        return responseData;
    } catch (error) {
        throw error;
    }

};

export const postApi = async (path, data, isTokenRequired = true, method = "POST", isFormData = false) => {
    const token = localStorage.getItem("userToken")
    const headerData = {}
    if (!isFormData) {
        headerData["Content-Type"] = "application/json";
    }
    if (isTokenRequired) {
        headerData["Authorization"] = `Bearer ${token}`;
    }
    try {
        const response = await fetch(`${baseUrl}${path}`, {
            method,
            headers: {
                ...headerData
            },
            body: isFormData ? data : JSON.stringify(data),
        })

        const responseData = await response.json();
        if (!response.ok) {
            throw responseData
        }
        return responseData;
    } catch (error) {
        throw error;
    }
};
