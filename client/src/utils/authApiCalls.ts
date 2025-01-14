import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const userSignUp = async (name: string, email: string, password: string) => {
    try {
        const response = await axios.post(`${BASE_URL}/signup`, {
            name, email, password
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const emailVerificationCode = async (verificationCode: string) => {
    try {
        const response = await axios.post(`${BASE_URL}/verify-email`, {
            verificationCode
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const userLogin = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${BASE_URL}/login`, {
            email, password
        }, {
            withCredentials: true
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const userLogout = async () => {
    try {
        const response = await axios.post(`${BASE_URL}/logout`, {}, {
            withCredentials: true
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const forgotPassword = async (email: string) => {
    try {
        const response = await axios.post(`${BASE_URL}/forgot-password`, {
            email
        }, {
            withCredentials: true
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const resetPassword = async (token: string | undefined, newPassword: string) => {
    if (!token) {
        throw new Error("Token is required!")
    }

    try {
        const response = await axios.post(`${BASE_URL}/reset-password/${token}`, {
            newPassword
        }, {
            withCredentials: true
        })

        return response;
    } catch (error) {
        throw error;
    }
};

export const fetchAllUsersData = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/get-all-users-data`, {
            withCredentials: true
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const updateUserRoles = async (userId: string, updatedRoles: string[]) => {
    try {
        const response = await axios.patch(`${BASE_URL}/update-role/${userId}`, {
            roles: updatedRoles
        }, {
            withCredentials: true
        })

        return response;
    } catch (error) {
        throw error;
    }
};

export const updateUserInfo = async (userId: string, name: string, email: string) => {
    try {
        const response = await axios.patch(`${BASE_URL}/modify-info/${userId}`, {
            name, email
        }, {
            withCredentials: true
        })

        return response;
    } catch (error) {
        throw error;
    }
};

export const deleteUser = async (userId: string) => {
    try {
        const response = await axios.delete(`${BASE_URL}/delete-user/${userId}`, {
            withCredentials: true
        })

        return response;
    } catch (error) {
        throw error;
    }
};
