import { GetServerSideProps } from "next";
import { destroyCookie, parseCookies } from "nookies";
import { AuthTokenError } from "../services/errors/AuthTokenError";
import decode from "jwt-decode";
import { type } from "os";
import { validadeUserPermissions } from "./validateUserPermissions";

type WithSSRAuthOptions = {
    permissions?: string[],
    roles?: string[]
}

type User = {
    permissions: string[],
    roles: string[]
}

export const withSSRAuth = <T extends { [key: string]: any; }>(
    func: GetServerSideProps<T>,
    options?: WithSSRAuthOptions
): GetServerSideProps<T> => {

    const other: GetServerSideProps<T> = async (ctx) => {
        const cookies = parseCookies(ctx);

        const token = cookies["nextauth.token"]

        if (!token) {
            return {
                redirect: {
                    destination: "/",
                    permanent: false
                }
            }
        }

        if (options) {
            const user = decode<User>(token);

            if (!validadeUserPermissions({ user, ...options })) {
                return {
                    redirect: {
                        destination: "/dashboard",
                        permanent: false
                    }
                }
            }
        }


        try {
            return await func(ctx);
        } catch (error) {
            if (error instanceof AuthTokenError) {
                destroyCookie(ctx, "nextauth.token")
                destroyCookie(ctx, "nextauth.refreshToken")

                return {
                    redirect: {
                        destination: "/",
                        permanent: false
                    }
                }
            }
            throw error
        }
    }

    return other
}