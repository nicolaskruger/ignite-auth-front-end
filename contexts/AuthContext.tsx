import { createContext, FC, useContext } from "react";

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
        console.log({
            email,
            password
        });

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