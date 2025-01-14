import { useEffect, useState } from 'react';
import styles from './ManagerDashboard.module.css';
import { fetchAllUsersData } from '../../utils/authApiCalls';
import Spinner from '../../components/loading/Spinner';

const ManagerDashboard = () => {
    const [users, setUsers] = useState<any>([]);
    const [loadingFetchAllUsers, setLoadingFetchAllUsers] = useState<boolean>(false);

    const fetchAllUsers = async () => {
        setLoadingFetchAllUsers(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const response = await fetchAllUsersData();

            setUsers(response.data.users);
            setLoadingFetchAllUsers(false);
        } catch (error: any) {
            console.error(error.response.message);
            setLoadingFetchAllUsers(false);
        }
    };

    useEffect(() => {
        fetchAllUsers();
    }, [])

    if (loadingFetchAllUsers) {
        return <div className={styles.spinnerWrapper}><Spinner /></div>;
    };

    return (
        <div className={styles.wrapper}>
            <h1>Welcome Manager. List of user (read-only):</h1>
            <table className={styles.userTable}>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Roles</th>
                        <th>Join Date</th>
                        <th>Last Login Date</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user: any) => (
                        <tr key={user._id}>
                            <td>{user._id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.roles.join(", ")}</td>
                            <td>{new Date(user.createdAt).toLocaleString()}</td>
                            <td>{new Date(user.lastLogin).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ManagerDashboard
