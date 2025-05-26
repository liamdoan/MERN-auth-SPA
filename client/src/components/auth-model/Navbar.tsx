import React, { useState } from 'react';
import styles from "./Navbar.module.css";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { UserType } from '../../utils/types';
import { deleteUser, updateUserInfo, userLogout } from '../../utils/authApiCalls';
import { logout } from '../../redux/slices/userSlice';
import LoadingBar from '../loading/LoadingBar';
import EditInfoPopup from './EditInfoPopup';
import ConfirmActionsPopup from './ConfirmActionsPopup';

const Navbar = () => {
    const [loading, setLoading] = useState<Boolean>(false);
    const [messageSuccess, setMessageSuccess] = useState<string>("");
    const [messageFailed, setMessageFailed] = useState<string>("");
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const [loadingEditInfo, setLoadingEditInfo] = useState<boolean>(false);
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
    const [isPopupEditInfoVisible, setIsPopupEditInfoVisible] = useState<boolean>(false);
    const [isPopupDeleteVisible, setIsPopupDeleteVisible] = useState<boolean>(false);

    const user = useSelector((state: RootState) => state.user.user) as UserType | null;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const response = await userLogout();

            setLoading(false);
            setMessageSuccess(response.data.message);
            dispatch(logout());
        } catch (error: any) {
            console.error(error);
            setMessageFailed(error.response.data.message);
            setLoading(false);
        }
    };

    const deleteMessage = user &&
        <p>
            Do you want to permanently delete your account?
            <br />
            <span>This action is irreversible.</span>
        </p>;

    const handleButtonClick = (type: 'edit-info' | 'delete') => {
        if (type === 'edit-info') {
            setIsPopupEditInfoVisible(true);
        } else {
            setIsPopupDeleteVisible(true);
        }
    };

    const handleConfirmEditInfo = async (updatedName: string, updatedEmail: string) => {
        if (!user) return;

        setLoadingEditInfo(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            await updateUserInfo(user._id, updatedName, updatedEmail);

            setLoadingEditInfo(false);
            setIsPopupEditInfoVisible(false);

            window.location.reload();
        } catch (error) {
            console.error(error);
            setLoadingEditInfo(false);
            setIsPopupEditInfoVisible(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!user) return;

        setLoadingDelete(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            await deleteUser(user._id);

            setLoadingDelete(false);
            setIsPopupDeleteVisible(false);
            setShowProfileMenu(false);
            
            // dispatch logout action to clear redux state
            dispatch(logout());

            // replace the current route with the home route
            // instead off adding a new one
            // so user can't go back to deleted user page
            navigate("/", { replace: true });
        } catch (error) {
            console.error(error);
            setLoadingDelete(false);
            setIsPopupDeleteVisible(false);
        }
    };

    const handleButtonCancel = (type: 'edit-info' | 'delete') => {
        if (type === 'edit-info') {
            setIsPopupEditInfoVisible(false);
        } else {
            setIsPopupDeleteVisible(false);
        }
    };

    return (
        <div className={styles.navbar}>
            <div className={styles.buttonWrapper}>
                {user?.roles.includes("admin") &&
                    <button className={styles.roleButton} onClick={() => navigate("/admin-dashboard")}>
                        Admin Dashboard
                    </button>
                }
                {user?.roles.includes("manager") &&
                    <button className={styles.roleButton} onClick={() => navigate("/manager-dashboard")}>
                        Manager Dashboard
                    </button>
                }
                <button className={styles.profileButton} onClick={() => setShowProfileMenu(!showProfileMenu)}>
                    Profile
                </button>
                {showProfileMenu &&
                    <div className={styles.profileMenu}>
                        <button className={styles.logoutButton} onClick={handleLogout}>
                            Log Out
                        </button>
                        <button className={styles.editInfoButton} onClick={() => handleButtonClick('edit-info')}>
                            Edit Account Info
                        </button>
                        <button className={styles.deleteButton} onClick={() => handleButtonClick('delete')}>
                            Delete Account
                        </button>
                        <button className={styles.closeButton} onClick={() => setShowProfileMenu(false)}>
                            &times;
                        </button>
                        { loading && <LoadingBar /> }
                        { messageSuccess && <span className={styles.messageSuccess}>{messageSuccess}</span> }
                        { messageFailed && <span className={styles.messageFailed}>{messageFailed}</span> }
                    </div>
                }
            </div>
            {isPopupEditInfoVisible && user &&
                <EditInfoPopup
                    initialName={user.name}
                    initialEmail={user.email}
                    loadingState={loadingEditInfo}
                    onConfirm={handleConfirmEditInfo}
                    onCancel={() => handleButtonCancel('edit-info')}
                />
            }
            {isPopupDeleteVisible &&
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

export default Navbar
