import { useAuth } from './AuthContext'

// Mantido por compatibilidade: agora lê do AuthContext, que já reage
// a login, logout e ao evento 'vinculo:profile-updated'.
export function useCurrentProfile() {
  return useAuth().profile
}
