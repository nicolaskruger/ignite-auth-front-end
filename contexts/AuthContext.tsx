import Router from "next/router";
import { createContext, FC, useContext, useEffect, useState } from "react";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import { api } from "../services/api";
import { HeadersDefaults } from "axios";

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

export function signOut() {
    destroyCookie(undefined, "nextauth.token")
    destroyCookie(undefined, "nextauth.refreshToken")
    Router.push("/")
}

export const AuthProvider: FC = ({ children }) => {

    const [user, setUser] = useState<User>();
    const isAuthenticated = !!user;

    useEffect(() => {
        const { "nextauth.token": token } = parseCookies();

        if (token) {
            api.get("/me")
                .then(response => {
                    setUser({
                        ...response.data
                    })
                })
                .catch(error => {
                    signOut()
                })
        }

    }, [])

    const sigIn = async ({ email, password }: SigInCredentials) => {
        try {
            const response = await api.post('/sessions', {
                email,
                password
            })

            const { token, refreshToken, permissions, roles } = response.data;

            setCookie(undefined, "nextauth.token", token, {
                maxAge: 60 * 60 * 24 * 30,
                path: "/"
            });
            setCookie(undefined, "nextauth.refreshToken", refreshToken, {
                maxAge: 60 * 60 * 24 * 30,
                path: "/"
            });

            setUser({
                email,
                permissions,
                roles
            });

            (api.defaults.headers as
                { Authorization: string } & HeadersDefaults)
            ["Authorization"] = `Baerer ${token}`;

            Router.push("/dashboard")
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