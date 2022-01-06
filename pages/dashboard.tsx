import { NextPage } from "next";
import { useAuth } from "../contexts/AuthContext";

const DashBoard: NextPage = () => {

    const { user } = useAuth();

    return (
        <h1>
            DashBoard
            <br />
            email: {user?.email}
        </h1>

    )
}

export default DashBoard