import { useSelector } from 'react-redux'
import NoPermission from './NoPermission'
import { selectAuthUser } from '../../features/auth/authSlice'
import type { ReactNode } from 'react'

interface PermissionCheckProps {
  children: ReactNode
  protectedRole?: string[]
}

const PermissionCheck = ({ children, protectedRole }: PermissionCheckProps) => {
  const user = useSelector(selectAuthUser)
  if (!protectedRole) return children
  if (
    user.userData &&
    protectedRole.some((role) => user.userData?.role === role)
  ) {
    return children
  }
  return <NoPermission />
}

export default PermissionCheck
