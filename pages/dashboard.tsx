import { NextPage } from "next";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";

const DashBoard: NextPage = () => {

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

export default DashBoard