import { useRouter } from "next/router";
import { createContext, FC, useContext, useState } from "react";
import { api } from "../services/api";

type User = {
    email: string,
    permissions: string[],
    roles: string[]
}

type SigInCredentials = {
    email: string,
    password: string
}

type AuthContextData = {
    sigIn: (credentials: SigInCredentials) => Promise<void>,
    isAuthenticated: boolean,
    user: User
}

export const AuthContext = createContext({} as AuthContextData)

export const AuthProvider: FC = ({ children }) => {

    const router = useRouter();

    const [user, setUser] = useState<User>();

    const isAuthenticated = !!user;

    const sigIn = async ({ email, password }: SigInCredentials) => {
        try {
            const response = await api.post('/sessions', {
                email,
                password
            })

            const { token, refreshToken, permissions, roles } = response.data;

            setUser({
                email,
                permissions,
                roles
            })

            router.push("/dashboard")
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            sigIn,
            user: user as User
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)