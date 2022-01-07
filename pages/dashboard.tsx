import { NextPage } from "next";
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

    try {
        const response = await api.get("/me");

        console.log(response.data);
    } catch (error) {
        console.log(error)
    }




    return {
        props: {

        }
    }
})

export default DashBoard