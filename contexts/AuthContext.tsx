import { createContext, FC, useContext } from "react";
import { api } from "../services/api";

type SigInCredentials = {
    email: string,
    password: string
}

type AuthContextData = {
    sigIn: (credentials: SigInCredentials) => Promise<void>,
    isAuthenticated: boolean,
}

export const AuthContext = createContext({} as AuthContextData)

export const AuthProvider: FC = ({ children }) => {

    const isAuthenticated = false;

    const sigIn = async ({ email, password }: SigInCredentials) => {
        try {
            const response = await api.post('/sessions', {
                email,
                password
            })
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            sigIn
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)