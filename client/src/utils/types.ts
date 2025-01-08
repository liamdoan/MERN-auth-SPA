export interface TodoType {
    _id: string,
    userId: string,
    task: string,
    description: string,
    isCompleted: boolean,
    createdAt: string,
    updatedAt: string
}

export interface UserType {
    name: string,
    email: string,
    lastLogin: string,
    isVerified: boolean,
    createdAt: string,
    updatedAt: string
}
