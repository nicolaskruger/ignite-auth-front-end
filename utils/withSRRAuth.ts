import { GetServerSideProps } from "next";
import { destroyCookie, parseCookies } from "nookies";
import { AuthTokenError } from "../services/errors/AuthTokenError";

export const withSSRAuth = <T extends { [key: string]: any; }>(func: GetServerSideProps<T>): GetServerSideProps<T> => {

    const other: GetServerSideProps<T> = async (ctx) => {
        const cookies = parseCookies(ctx);

        if (!cookies["nextauth.token"]) {
            return {
                redirect: {
                    destination: "/",
                    permanent: false
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