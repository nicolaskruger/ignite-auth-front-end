import { FC } from "react";
import { useCan } from "../hooks/useCan";

type CanProps = {
    permissions?: string[],
    roles?: string[]
}

export const Can: FC<CanProps> = ({ children, permissions, roles }) => {

    const userCanSeeComponente = useCan({
        permissions,
        roles
    })

    if (!userCanSeeComponente) {
        return null;
    }

    return (
        <>
            {children}
        </>
    )
}