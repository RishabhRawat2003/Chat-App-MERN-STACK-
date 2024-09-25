import axios from 'axios';

export const refreshAccessToken = async () => {
    try {
        const response = await axios.post('/api/v1/users/refresh-token', {}, {
            withCredentials: true,
        });

        return response.data.accessToken;
    } catch (error) {
        throw error;
    }
};

export const getValidAccessToken = async () => {
    try {
        const response = await axios.post('/api/v1/users/user-details', {
            withCredentials: true,
        });

        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            await refreshAccessToken();
            return getValidAccessToken();
        } else {
            throw error;
        }
    }
};
