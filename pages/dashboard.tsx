import { NextPage } from "next";
import { destroyCookie } from "nookies";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { setupApiClient } from "../services/api";
import { api } from "../services/apiClient";
import { withSSRAuth } from "../utils/withSRRAuth";

type Result = {}

const DashBoard: NextPage<Result> = () => {

    const { user } = useAuth();

    useEffect(() => {
        api.get("/me")
            .catch(error => {

            })
    }, [])

    return (
        <h1>
            DashBoard
            <br />
            email: {user?.email}
        </h1>

    )
}

export const getServerSideProps = withSSRAuth<Result>(async (ctx) => {

    const api = setupApiClient(ctx)

    const response = await api.get("/me");

    return {
        props: {

        }
    }
})

export default DashBoard