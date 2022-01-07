import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";

export const withSSRGuest = <T extends { [key: string]: any; }>(func: GetServerSideProps<T>): GetServerSideProps<T> => {

    const other: GetServerSideProps<T> = async (ctx) => {
        const cookies = parseCookies(ctx);

        if (cookies["nextauth.token"]) {
            return {
                redirect: {
                    destination: "/dashboard",
                    permanent: false
                }
            }
        }

        return await func(ctx);
    }

    return other
}