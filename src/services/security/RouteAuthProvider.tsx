import {createContext, useEffect, useState} from "react";
import AuthenticationApi, {ILoginDetails} from "../api/AuthenticationApi.ts";

const debug = true;
const authenticationApi = new AuthenticationApi();
export const AuthContext = createContext({
    isAuthenticated: false,
    // @ts-ignore
    login: async (details: ILoginDetails) => {},
    logout: () => {}
});

// @ts-ignore
const RouteAuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        localStorage.getItem("access_token") ? setIsAuthenticated(true) : setIsAuthenticated(false);
    }, []);

    const login = async (details: ILoginDetails) => {
        if(debug)console.log("login")
        // //use below line to fake login in development
        // localStorage.setItem("access_token", import.meta.env.VITE_REACT_APP_TEST_TOKEN as string);
        // setIsAuthenticated(true);
        // return;

        //use below for actual login with backend
        await authenticationApi.login(details)
            .then((response) => {
                let accessToken = response.accessToken;
                let refreshToken = response.refreshToken;
                localStorage.setItem("access_token", accessToken);
                localStorage.setItem("refresh_token", refreshToken);
                setIsAuthenticated(true);
            })
            .catch((error) => {
                console.log(error.message)
                alert("Login failed, please try again")
            });

    }
    const logout = () => {
        if(debug)console.log("logout")
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setIsAuthenticated(false);
    }

    const contextValue = {
        isAuthenticated,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default RouteAuthProvider;