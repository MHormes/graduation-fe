import RouteAuthProvider from "./services/security/RouteAuthProvider";
import {Route, Routes} from "react-router-dom";
import ProtectedRoute from "./services/security/ProtectedRoute";
import LoginScreen from "./pages/home/LoginScreen";
import ContractPeriodsOverview from "./pages/contractPeriodOverview/ContractPeriodsOverview.tsx";

const App = () => {
    return (
        <>
            <RouteAuthProvider>
                {/*<Navbar/>*/}
                <Routes>
                    <Route path="/" element={
                        <LoginScreen
                        />
                    }/>

                    <Route path="/periods" element={
                        <ProtectedRoute>
                            <ContractPeriodsOverview/>
                        </ProtectedRoute>
                    }/>
                </Routes>
            </RouteAuthProvider>
        </>
    )
}

export default App;
