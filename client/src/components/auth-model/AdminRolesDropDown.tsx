import React, { useState } from "react";
import styles from './AdminRolesDropDown.module.css';
import { updateUserRoles } from "../../utils/authApiCalls";
import LoadingBar from "../loading/LoadingBar";


interface AdminRoleDropdownProps {
    userId: string;
    roles: string[];
    selectedRoles: string[];
    onSave: (updatedRoles: string[]) => void;
}

const AdminRolesDropDown: React.FC<AdminRoleDropdownProps> = ({ userId, roles, selectedRoles, onSave }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectingRoles, setSelectingRoles] = useState<string[]>([...selectedRoles]);
    const [isRolesChanged, setIsRolesChanged] = useState<boolean>(false);
    const [loading, setLoading]= useState<boolean>(false);

    const toggleDropdown = () => setIsOpen((prev) => !prev);

    // check if updatedRoles array is equal to selectedRoles prop,
    // then decide button disabled attribute
    const arraysEqual = (arr1: string[], arr2: string[]) => {
        return arr1.length === arr2.length && arr1.every((role, index) => arr2[index] === role);
    };

    const handleRoleChange = (role: string) => {
        const updatedRoles = selectingRoles.includes(role)
            ? selectingRoles.filter((r) => r !== role)
            : [...selectingRoles, role];

        setIsRolesChanged(!arraysEqual(updatedRoles, selectedRoles));
        setSelectingRoles(updatedRoles);
    };

    const handleClose = () => {
        setSelectingRoles([...selectedRoles]);
        setIsOpen(false);
        setIsRolesChanged(false);
    };

    const handleSaveRoles = async () => {
        setLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            await updateUserRoles(userId, selectingRoles);

            onSave(selectingRoles);
            setLoading(false);
            setIsOpen(false);
            setIsRolesChanged(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    return (
        <div className={styles.wrapper}>
            <span className={styles.arrow} onClick={toggleDropdown}>▼</span>
            {isOpen && (
                <div className={styles.dropdownPanel}>
                    {roles.map((role) => (
                        <label className={styles.roleLabel} key={role}>
                            <input
                                className={styles.roleCheckbox}
                                type="checkbox"
                                checked={selectingRoles.includes(role)}
                                onChange={() => handleRoleChange(role)}
                            />
                            {role}
                        </label>
                    ))}
                    <div className={styles.buttonWrapper}>
                        <button className={styles.cancelButton} onClick={handleClose}>Cancel</button>
                        <button className={styles.saveButton} onClick={handleSaveRoles} disabled={!isRolesChanged}>Save</button>
                    </div>
                    {loading && <LoadingBar />}
                </div>
            )}
        </div>
    );
};

export default AdminRolesDropDown;
