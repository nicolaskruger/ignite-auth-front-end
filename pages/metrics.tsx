import { NextPage } from "next";
import { setupApiClient } from "../services/api";
import { withSSRAuth } from "../utils/withSRRAuth";

const Metrics: NextPage = () => {
    return (
        <>
            <h1>Matrics</h1>
        </>
    )
}


export const getServerSideProps = withSSRAuth(async (ctx) => {

    const api = setupApiClient(ctx);

    const response = await api.get("/me")


    return {
        props: {

        }
    }
}, {
    permissions: ["metrics.list"],
    roles: ["administrator"]
})

export default Metrics