import styles from "./ProtectedRoute.module.css";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../redux/store";
import Spinner from "../components/loading/Spinner";

const ProtectedRouteAdmin = ({ component }: { component: JSX.Element }) => {
    const user: any = useSelector((state: RootState) => state.user.user)
    const isCheckingUserAuthenticated = useSelector((state: RootState) => state.user.isCheckingUserAuthenticated);
    const isUserAuthenticated = useSelector((state: RootState) => state.user.isUserAuthenticated);

    if (isCheckingUserAuthenticated) {
        return <div className={styles.spinnerWrapper}><Spinner /></div>;
    }

    if (!isUserAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (!user.roles.includes("admin")) {
        return <Navigate to="/login" />;
    }

    return component;
};

export default ProtectedRouteAdmin
