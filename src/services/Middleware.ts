import axios, {AxiosInstance} from "axios";

export default class Middleware {
    requestSender: AxiosInstance


    constructor(axios: AxiosInstance) {
        this.requestSender = axios

        this.setBearerTokenInterceptor()
        this.authorizationErrorInterceptor()
    }

    log(message: string) {
        const debug = true; // This should probably be set as a class property or external configuration
        if (debug) {
            console.log(`[Middleware] - ${message} `);
        }
    }


    // Intercepts axios requests and adds auth headers before request is send
    setBearerTokenInterceptor() {
        this.log("Setting up Bearer Token Interceptor")
        this.requestSender.interceptors.request.use(
            async (config) => {

                const token = localStorage.getItem("access_token");
                if (token === null) {
                    return config;
                }

                this.log("Success: authToken is set");

                config.headers.Authorization = `Bearer ${token}`;
                config.headers.Accept = "application/json";

                this.log(`Request headers are set: ${JSON.stringify(config.headers)}`);
                this.log("Ready to send request..");

                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }


    isErrorResponseForRetry(status: number) {
        return [401, 403].includes(status);
    }

    isErrorResponseToNotify(status: number) {
        return [400, 500, 408].includes(status);
    }

    // Checks if request has failed; if failed, it refreshes the auth token
    authorizationErrorInterceptor() {
        this.requestSender.interceptors.response.use(
            (response) => {
                this.log("Request success..");
                return response;
            },
            async (error) => {
                this.log(`Request error: ${error}`);

                const originalRequest = error.config;
                const responseStatus = error.response.status;

                if (this.isErrorResponseForRetry(responseStatus) && !originalRequest._retry) {
                    this.log(`Unauthorized or Forbidden response status ${responseStatus}: ${error.message}`);

                    originalRequest._retry = true;

                    try {
                        const newAccessToken = await this.refreshToken();
                        this.log("Token refreshed");

                        // Set the new access token in the headers
                        axios.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
                        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

                        this.log("Retry original request..");

                        // Retry the original request with the new access token
                        return this.requestSender(originalRequest);
                    } catch (e) {
                        this.log("Token refresh failed, not retrying the request");
                        return Promise.reject(error);
                    }
                }

                if (this.isErrorResponseToNotify(responseStatus)) {
                    this.log(`Notify due to response status ${responseStatus}: ${error.message}`);
                }

                return Promise.reject(error);
            }
        );
    }

    async refreshToken() {
        try {
            const refreshToken = localStorage.getItem("refresh_token");
            if (!refreshToken) {
                throw new Error("No refresh token available");
            }
            console.log("refreshToken", refreshToken)

            const response = await this.requestSender.post("/auth/refresh", { refreshToken });
            const newAccessToken = response.data.accessToken;

            localStorage.setItem("access_token", newAccessToken);

            return newAccessToken;
        } catch (error) {
            // If there's an error (e.g., refresh token is expired), remove tokens
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            throw error;
        }
    }

}