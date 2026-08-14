import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AuditService } from '@/services/AuditService'
import { Database } from '@/types/database.types'
import { useRealtimeSubscription } from '@/hooks/useRealtime'
import { useAppMutation } from '@/hooks/useAppMutation'

const auditService = new AuditService()

export function useAuditLogs() {
  const queryClient = useQueryClient()
  
  useRealtimeSubscription('audit_logs', () => {
    queryClient.invalidateQueries({ queryKey: ['audit_logs'] })
  })

  return useQuery({
    queryKey: ['audit_logs'],
    queryFn: () => auditService.getAllLogs(),
  })
}

export function useCreateAuditLog() {
  const queryClient = useQueryClient()

  return useAppMutation({
    mutationFn: (data: Database['public']['Tables']['audit_logs']['Insert']) => 
      auditService.createLog(data),
    successMessage: 'Audit log created.',
    errorMessage: 'Failed to create audit log.',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audit_logs'] })
    },
  })
}
