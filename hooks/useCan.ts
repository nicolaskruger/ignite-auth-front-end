import { useAuth } from "../contexts/AuthContext"
import { validadeUserPermissions } from "../utils/validateUserPermissions";

type UseCamParams = {
    permissions?: string[];
    roles?: string[]
}

export const useCan = ({ permissions = [], roles = [] }: UseCamParams) => {
    const { user, isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        return false
    }

    return validadeUserPermissions({ user, permissions, roles })
}