import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';


export const isTokenExpired = (token) => {
    if (!token) return true;

    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        return decodedToken.exp < currentTime;
    } catch (error) {
        console.error('Failed to decode token', error);
        return true;
    }
};

export const refreshAccessToken = async () => {
    try {
        const refreshToken = Cookies.get('refreshToken');

        if (!refreshToken) {
            localStorage.setItem('user', JSON.stringify(false))
            // throw new Error('No refresh token available')
        }

        const response = await axios.post('http://localhost:8000/api/v1/users/refresh-token', {
            token: refreshToken,
        });

        const newAccessToken = response.data.accessToken;
        Cookies.set('accessToken', newAccessToken);

        return newAccessToken;
    } catch (error) {
        // console.error('Failed to refresh token', error);
        throw error;
    }
};

export const getValidAccessToken = async () => {
    let accessToken = Cookies.get('accessToken');

    if (isTokenExpired(accessToken)) {
        accessToken = await refreshAccessToken();
    }

    localStorage.setItem('user', JSON.stringify(true))
    return accessToken;
};
