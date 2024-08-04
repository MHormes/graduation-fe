import axios, {AxiosInstance} from "axios";
import Middleware from "../Middleware";

const debug = false;
export default class ApiInstance {

    static init() {
        const axiosInstance: AxiosInstance = axios.create({baseURL: import.meta.env.VITE_REACT_APP_API_BASE_URL as string});

        new Middleware(axiosInstance);

        axiosInstance.defaults.headers.common = {
            Accept: "application/json"
        };
        if (debug) console.log("axiosInstance", axiosInstance.defaults.headers.common);
        return axiosInstance;
    }
}