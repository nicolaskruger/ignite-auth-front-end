import axios, { AxiosError, AxiosRequestHeaders, HeadersDefaults } from "axios";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { signOut } from "../contexts/AuthContext";

type FailRequest = {
    onSuccess: (token: string) => void,
    onFailure: (err: AxiosError) => void
}

let cookies = parseCookies();
let isRefreshing = false;
let failRequestQueue: FailRequest[] = []

type Header = { Authorization: string } & AxiosRequestHeaders

const createHeader = (header: Header) => header

export const api = axios.create({
    baseURL: "http://localhost:3333/",
    headers: createHeader({
        Authorization: `Bearer ${cookies["nextauth.token"]}`
    })
})

api.interceptors.response.use(res => res,
    (error: AxiosError) => {
        if (error.response?.status === 401)
            if (error.response.data?.code === "token.expired") {
                cookies = parseCookies()

                const { "nextauth.refreshToken": refreshToken } = cookies;
                const originalConfig = error.config;

                if (!isRefreshing) {
                    isRefreshing = true
                    api.post("/refresh", {
                        refreshToken,
                    }).then(response => {
                        const { token } = response.data;

                        setCookie(undefined, "nextauth.token", token, {
                            maxAge: 60 * 60 * 24 * 30,
                            path: "/"
                        });
                        setCookie(undefined, "nextauth.refreshToken", response.data.refreshToken, {
                            maxAge: 60 * 60 * 24 * 30,
                            path: "/"
                        });

                        (api.defaults.headers as { Authorization: string } & HeadersDefaults)["Authorization"] = `Baerer ${token}`;

                        failRequestQueue.forEach(request => request.onSuccess(token))

                        failRequestQueue = []

                    }).catch(err => {
                        failRequestQueue.forEach(request => request.onFailure(err))

                        failRequestQueue = []
                    }).finally(() => {
                        isRefreshing = false
                    })
                }

                return new Promise((resolve, rejects) => {
                    failRequestQueue.push({
                        onSuccess: (token: string) => {
                            (originalConfig?.headers as
                                AxiosRequestHeaders)["Authorization"] = `Bearer ${token}`
                            resolve(api(originalConfig))
                        },
                        onFailure: (err: AxiosError) => {
                            rejects(err)
                        }
                    })
                })
            } else {
                signOut()
            }
        return Promise.reject(error)
    })