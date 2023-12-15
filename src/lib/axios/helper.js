import { apiRequest } from "./apiRequest"

const getFields = async (model, type, setState, stopLoading) => {
    const response = await apiRequest({ method: 'get', endPoint: `/common-services/fields/${type}/${model}` });
    setState(response.data);
    stopLoading();
}

export { getFields };