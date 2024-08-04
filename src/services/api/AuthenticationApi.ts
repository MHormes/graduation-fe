import axios, {AxiosInstance, AxiosResponse} from "axios";
import apiInstance from "./ApiInstance.ts";

let api: AxiosInstance;
const prefix = "/auth"

export interface ILoginDetails{
    username: string,
    password: string

}

const debug = false;
export default class AuthenticationApi {

    constructor() {
        api = apiInstance.init();
    }

    login = async (details: ILoginDetails) => {
        const data = {
            username: details.username,
            password: details.password
        }

        return api
            .post(prefix + "/login", data)
            .then((response: AxiosResponse) => {
                if(debug) console.log(response.data);
                if(response.status === 200){
                    return response.data;
                }
            })
            .catch((error) => {
                console.log(error.message)
                throw error;
            });
    }

    refreshToken = async() => {
        try {
            const refreshToken = localStorage.getItem("refresh_token");
            if (!refreshToken) {
                throw new Error("No refresh token available");
            }

            const response = await axios.post(prefix + "/refresh", { refreshToken });
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

