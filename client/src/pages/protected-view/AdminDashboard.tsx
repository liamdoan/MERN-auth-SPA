import { useEffect, useState } from 'react';
import styles from './AdminDashboard.module.css';
import { deleteUser, fetchAllUsersData, updateUserInfo } from '../../utils/authApiCalls';
import Spinner from '../../components/loading/Spinner';
import AdminRolesDropDown from '../../components/auth-model/AdminRolesDropDown';
import EditInfoPopup from '../../components/auth-model/EditInfoPopup';
import ConfirmActionsPopup from '../../components/auth-model/ConfirmActionsPopup';

const AdminDashboard = () => {
    const [users, setUsers] = useState<any>([]);
    const [loadingFetchAllUsers, setLoadingFetchAllUsers] = useState<boolean>(false);
    
    const [loadingEditInfo, setLoadingEditInfo] = useState<boolean>(false);
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
    const [userToEditInfo, setUserToEditInfo] = useState<any>(null);
    const [userToDelete, setUserToDelete] = useState<any>(null);
    const [isPopupEditInfoVisible, setIsPopupEditInfoVisible] = useState<boolean>(false);
    const [isPopupDeleteVisible, setIsPopupDeleteVisible] = useState<boolean>(false);

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

    // update UI after saving new assigned roles
    const updateUserRoles = (userId: string, updatedRolesList: string[]) => {
        setUsers((prevUsers: any) =>
            prevUsers.map((user: any) =>
                user._id === userId ? {...user, roles: updatedRolesList} : user
            )
        );
    };

    const handleButtonClick = (user: any, type: 'edit-info' | 'delete') => {
        if (type === 'edit-info') {
            setUserToEditInfo(user);
            setIsPopupEditInfoVisible(true);
        } else {
            setUserToDelete(user);
            setIsPopupDeleteVisible(true);
        }
    };

    const handleConfirmEditInfo = async (updatedName: string, updatedEmail: string) => {
        setLoadingEditInfo(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            await updateUserInfo(userToEditInfo._id, updatedName, updatedEmail);

            setUsers((prevUsers: any) =>
                prevUsers.map((user: any) =>
                    user._id === userToEditInfo._id ? {...user, name: updatedName, email: updatedEmail} : user
                )
            );

            setLoadingEditInfo(false);
            setIsPopupEditInfoVisible(false);
        } catch (error) {
            console.error(error);
            setLoadingEditInfo(false);
            setIsPopupEditInfoVisible(false);
        }
    };

    const deleteMessage = userToDelete &&
        <p>
            Do you want to permanently delete user <strong>{userToDelete.name}</strong>?
            <br />
            <span>(id: <strong>{userToDelete._id}</strong>)</span>
        </p>;

    const handleConfirmDelete = async () => {
        setLoadingDelete(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            await deleteUser(userToDelete._id);

            setUsers((prevUsers: any) => prevUsers.filter((user: any) => user._id !== userToDelete._id));
            setLoadingDelete(false);
        } catch (error) {
            console.error(error);
            setLoadingDelete(false);
        }

        setIsPopupDeleteVisible(false);
    };

    const handleButtonCancel = (type: 'edit-info' | 'delete') => {
        if (type === 'edit-info') {
            setIsPopupEditInfoVisible(false);
        } else {
            setIsPopupDeleteVisible(false);
        }
    };

    return (
        <div className={styles.wrapper}>
            <h1>Welcome Admin. List of user:</h1>
            <table className={styles.userTable}>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Roles</th>
                        <th>Join Date</th>
                        <th>Last Login Date</th>
                        <th className={styles.editInfoCell}>Edit info</th>
                        <th className={styles.deleteCell}>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user: any) => (
                        <tr key={user._id}>
                            <td>{user._id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <div className={styles.cellRoles}>
                                    {user.roles.join(", ")}
                                    <AdminRolesDropDown
                                        userId={user._id}
                                        roles={["user", "admin", "manager"].map(role => role.toLowerCase())}
                                        selectedRoles={user.roles}
                                        onSave={(updatedRolesList) => updateUserRoles(user._id, updatedRolesList)}
                                    />
                                </div>
                            </td>
                            <td>{new Date(user.createdAt).toLocaleString()}</td>
                            <td>{new Date(user.lastLogin).toLocaleString()}</td>
                            <td>
                                <button
                                    className={styles.editInfoButton}
                                    onClick={() => handleButtonClick(user, 'edit-info')}
                                >
                                    Edit info
                                </button>
                            </td>
                            <td>
                                <button
                                    className={styles.deleteButton}
                                    onClick={() => handleButtonClick(user, 'delete')}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isPopupEditInfoVisible && userToEditInfo &&
                <EditInfoPopup
                    initialName={userToEditInfo.name}
                    initialEmail={userToEditInfo.email}
                    loadingState={loadingEditInfo}
                    onConfirm={handleConfirmEditInfo}
                    onCancel={() => handleButtonCancel('edit-info')}
                />
            }
            {isPopupDeleteVisible && userToDelete &&
                <ConfirmActionsPopup
                    loadingState={loadingDelete}
                    message={deleteMessage}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => handleButtonCancel('delete')}
                />
            }
        </div>
    )
}

export default AdminDashboard
