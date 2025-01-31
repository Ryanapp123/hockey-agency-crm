import { useAuth } from "../contexts/AuthContext"

export function usePermissions() {
  const { user } = useAuth()

  const isAdmin = user?.role === "ADMIN"
  const isAgent = user?.role === "AGENT"
  const isAssistant = user?.role === "ASSISTANT"

  const canManagePlayers = isAdmin || isAgent
  const canManageInvoices = isAdmin || isAgent
  const canManagePotentialClients = isAdmin || isAgent
  const canDeleteRecords = isAdmin

  return {
    isAdmin,
    isAgent,
    isAssistant,
    canManagePlayers,
    canManageInvoices,
    canManagePotentialClients,
    canDeleteRecords,
  }
}


