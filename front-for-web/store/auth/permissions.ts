import { useMemo } from 'react'
import { useAppSelector } from '../hooks'
import type { RoleName, UserRole } from './roles'

const extractRoleNames = (roles?: UserRole[] | null): RoleName[] => {
  if (!roles || roles.length === 0) return []
  return roles.map((r) => r.name)
}

export const hasRole = (userRoles: RoleName[], role: RoleName): boolean =>
  userRoles.includes(role)

export const hasAnyRole = (userRoles: RoleName[], roles: RoleName[]): boolean =>
  roles.some((role) => userRoles.includes(role))

export const hasAllRoles = (userRoles: RoleName[], roles: RoleName[]): boolean =>
  roles.every((role) => userRoles.includes(role))

export const useAuthorization = () => {
  const userRoles = useAppSelector((state) => state.auth.user?.roles)

  const roleNames = useMemo(() => extractRoleNames(userRoles), [userRoles])

  return {
    roles: roleNames,
    hasRole: (role: RoleName) => hasRole(roleNames, role),
    hasAnyRole: (roles: RoleName[]) => hasAnyRole(roleNames, roles),
    hasAllRoles: (roles: RoleName[]) => hasAllRoles(roleNames, roles),
  }
}
