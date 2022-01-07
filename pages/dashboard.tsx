import { NextPage } from "next";
import { destroyCookie } from "nookies";
import { useEffect } from "react";
import { Can } from "../components/Can";
import { useAuth } from "../contexts/AuthContext";
import { useCan } from "../hooks/useCan";
import { setupApiClient } from "../services/api";
import { api } from "../services/apiClient";
import { withSSRAuth } from "../utils/withSRRAuth";

type Result = {}

const DashBoard: NextPage<Result> = () => {

    const { user, signOut } = useAuth();

    useEffect(() => {
        api.get("/me")
            .catch(error => {

            })
    }, [])

    return (
        <>
            <h1>
                DashBoard email: {user?.email}
            </h1>

            <button onClick={signOut}>
                sign Out
            </button>

            <Can permissions={["metrics.list"]}>
                <div>Métricas</div>
            </Can>
        </>

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