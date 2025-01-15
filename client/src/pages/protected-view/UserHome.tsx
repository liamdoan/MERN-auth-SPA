import styles from "./UserHome.module.css";
import { useSelector } from "react-redux"
import { RootState } from "../../redux/store"
import { Navigate } from "react-router-dom";
import { UserType } from "../../utils/types";
import Navbar from "../../components/auth-model/Navbar";
import Spinner from "../../components/loading/Spinner";
import Todo from "../../components/main-app/Todo";

const UserHome = () => {
    const user = useSelector((state: RootState) => state.user.user) as UserType | null;
    const isCheckingUserAuthenticated = useSelector((state: RootState) => state.user.isCheckingUserAuthenticated);
    const isUserAuthenticated = useSelector((state: RootState) => state.user.isUserAuthenticated);

    if (isCheckingUserAuthenticated) {
        return <div className={styles.spinnerWrapper}><Spinner /></div>;
    }

    if (!isUserAuthenticated) {
        return <Navigate to="/login" />;
    }
    
    return (
        <div className={styles.wrapper}>
            <Navbar />
            <div className={styles.userInfo}>
                <p>Hello, {user?.name}</p>
                <p>Your email is: {user?.email}</p>
                <p>Your role is: {user?.roles.join(', ')}</p>
                <p>You joined on: {new Date (user?.createdAt as string).toLocaleString()}</p>
                <p>You last logged in on: {user && new Date(user?.lastLogin).toLocaleString()}</p>
            </div>
            <div className={styles.mainSection}>
                <Todo />
            </div>
        </div>
    )
}

export default UserHome
