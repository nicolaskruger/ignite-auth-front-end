import axios, { AxiosRequestHeaders, HeadersDefaults } from "axios";
import { parseCookies } from "nookies";

const cookies = parseCookies();

type Header = { Authorization: string } & AxiosRequestHeaders

const createHeader = (header: Header) => header

export const api = axios.create({
    baseURL: "http://localhost:3333/",
    headers: createHeader({
        Authorization: `Bearer ${cookies["nextauth.token"]}`
    })
})