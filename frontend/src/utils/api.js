import axios from "axios";
import TokenService from "./tokenService";

const instance = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_BASE_URL}/api/`,
    headers: {
        "Content-type": "application/json; charset=UTF-8",
    },
});

instance.interceptors.request.use(
    (config) => {
        const token = TokenService.getLocalAccessToken();

        if (token) {
            config.headers["Authorization"] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

instance.interceptors.response.use(
    (res) => {
        return res;
    },
    async (err) => {
        const originalConfig = err.config;

        if (originalConfig.url !== "/auth/login" && err.response) {
            // Access Token was expired
            if (err.response.status === 401 && !originalConfig._retry) {
                originalConfig._retry = true;

                try {
                    const rs = await instance.post("/auth/refresh", {
                        refreshToken: TokenService.getLocalRefreshToken(),
                    });

                    const { accessToken } = rs.data;
                    TokenService.updateLocalAccessToken(accessToken);

                    return instance(originalConfig);
                } catch (_error) {
                    return Promise.reject(_error);
                }
            }
        }

        return Promise.reject(err);
    },
);

export default instance;
