import {useLocation, useNavigate} from "react-router";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../services/security/RouteAuthProvider";
import CardTitle from "../../components/CardTitle";
import CardButton from "../../components/CardButton";
import CardTextBox from "../../components/CardTextBox.tsx";


const LoginScreen = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const { isAuthenticated, login } = useContext(AuthContext);

    const [loginDetails, setLoginDetails] = useState({username: "", password: ""});

    const [loading, setLoading] = useState<boolean>(false);

    // @ts-ignore
    const onChange = (e) => {
        setLoginDetails({
            ...loginDetails,
            [e.target.name]: e.target.value
        })
    }

    useEffect(() => {

        if (isAuthenticated) {
            console.log("Already authenticated, redirecting...");
            const origin = location.state?.from?.pathname || '/periods';
            navigate(origin);
        }
    }, [navigate, isAuthenticated, location.state?.from?.pathname]);

    const handleLogin = async () => {
        setLoading(true);
        await login(loginDetails);
        setLoading(false);
    };

    return (
        <div className="card card-side bg-base-300 m-3">
            <div className="card-body items-center text-center">
                <CardTitle cardTitle={"Login"} centered={true}/>
                <CardTextBox boxHint={"username"} boxLabel={"Username"} fieldName={"username"} onChange={onChange} value={loginDetails.username}/>
                <CardTextBox boxHint={"password"} boxLabel={"Password"} fieldName={"password"} type={"password"} onChange={onChange} value={loginDetails.password}/>
                <CardButton
                    buttonAction={() => handleLogin()}
                    buttonText={"Login"}
                />
                {loading &&
                    <p>Loading...</p>}
            </div>
        </div>
    )
}

export default LoginScreen;