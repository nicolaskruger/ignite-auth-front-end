import axios, { AxiosError, AxiosRequestHeaders, HeadersDefaults } from "axios";
import { parseCookies, setCookie } from "nookies";

let cookies = parseCookies();

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

                })

            } else {

            }
    })