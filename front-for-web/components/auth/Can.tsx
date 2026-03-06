import * as React from 'react'
import type { ReactNode } from 'react'
import type { RoleName } from '../../store/auth/roles'
import { useAuthorization } from '../../store/auth/permissions'

type CanProps = {
  any?: RoleName[]
  all?: RoleName[]
  fallback?: ReactNode
  children: ReactNode
}

const Can: React.FC<CanProps> = ({ any, all, fallback = null, children }) => {
  const { hasAnyRole, hasAllRoles } = useAuthorization()

  const passesAny = !any || hasAnyRole(any)
  const passesAll = !all || hasAllRoles(all)

  if (passesAny && passesAll) {
    return <>{children}</>
  }

  return <>{fallback}</>
}

export default Can
