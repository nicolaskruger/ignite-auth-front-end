import { type } from "os"

type User = {
    permissions: string[],
    roles: string[]
}

type ValidadeUserPermissionsParams = {
    user: User,
    permissions?: string[],
    roles?: string[]
}

export const validadeUserPermissions = (
    { user, permissions = [], roles = [] }: ValidadeUserPermissionsParams) => {
    if (permissions?.length > 0) {
        const hasAllPermissions = permissions.every(permission => {
            return user.permissions.includes(permission)
        })

        if (!hasAllPermissions) {
            return false
        }
    }

    if (roles?.length > 0) {
        const hasAllRoles = roles.some(permission => {
            return user.roles.includes(permission)
        })

        if (!hasAllRoles) {
            return false
        }
    }

    return true
}