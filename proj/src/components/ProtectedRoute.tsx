import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { LoaderCircle } from 'lucide-react'
import { useAuth } from '../hooks/AuthContext'

export function ProtectedRoute({ role }: { role: 'cliente' | 'psicologo' }) {
  const { session, profile, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-cream dark:bg-[#08110e]">
        <LoaderCircle className="animate-spin text-sage-500" size={34} />
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/entrar" replace state={{ from: location.pathname }} />
  }

  // Sessão existe mas o perfil ainda não carregou desta vez: aguarda o próximo render.
  if (!profile) {
    return (
      <div className="grid min-h-screen place-items-center bg-cream dark:bg-[#08110e]">
        <LoaderCircle className="animate-spin text-sage-500" size={34} />
      </div>
    )
  }

  if (profile.role !== role) {
    return <Navigate to={profile.role === 'cliente' ? '/cliente/descobrir' : '/psicologo/dashboard'} replace />
  }

  return <Outlet />
}
