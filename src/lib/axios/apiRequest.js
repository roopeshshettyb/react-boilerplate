import axios from 'axios';
import constants from '../../config/constants';
import { toast } from "react-toastify";

let loggedOutErrorMessage = 'Your session has expired. Please login.'; //DO NOT CHANGE WITHOUT CHANGING BACKEND

const logout = () => {
    localStorage.removeItem('user');
    window.location.href = ('/users/login');
}

const apiRequest = async ({ method, formData = false, payload, endPoint, token, otherParams, rawResponse = false, notify, startLoading = null, stopLoading = null }) => {

    let loadingTimer = null;

    try {

        if (startLoading) {
            loadingTimer = setTimeout(() => {
                startLoading();
            }, 750);
        }

        let showLogs = false;
        if (constants.API_URL === 'http://localhost:8000/dev') {
            showLogs = true;
        }

        var request = {
            method,
            url: `${constants.API_URL}${endPoint}`,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (payload) {
            if (!formData) {
                request.data = JSON.stringify(payload);
            } else {
                request.data = payload;
                request.headers['Content-Type'] = 'multipart/form-data';
            }
        };

        if (token) request.headers["Authorization"] = `${token}`;
        if (otherParams && Object.keys(otherParams).length > 0) request = { ...otherParams, ...request };

        if (showLogs) {
            console.log('API Request \n', request);
        }

        const response = await axios(request);

        if (showLogs) {
            console.log('API Response \n', response);
        }

        if (rawResponse) {
            return response;
        }

        if (startLoading) {
            clearTimeout(loadingTimer);
        }

        if (stopLoading) {
            stopLoading();
        }

        if (notify && response.data && response.data.success && response.data.message) {
            toast.success(response.data.message);
        }

        return response.data;

    } catch (error) {
        console.log('API Error \n', error);
        if (notify && error.response && error.response.data && error.response.data.error) {
            toast.error(error.response.data.error);
        }
        if (startLoading) {
            stopLoading();
            clearTimeout(loadingTimer);
        }
        if (error.response && error.response.data && error.response.data.error && error.response.data.error === loggedOutErrorMessage) {
            logout();
        }
        if (error.response && error.response.data) return error.response.data;
        toast.error('Internal Server Error. Please wait and try again later');
        return { success: false };
    }
};

export { apiRequest };
