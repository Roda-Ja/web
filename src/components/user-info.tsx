'use client'

import { usePermissions } from '@/hooks/use-permissions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function UserInfo() {
  const permissions = usePermissions()

  if (!permissions.isAuthenticated) {
    return null
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-sm">Informações do Usuário</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Role:</span>
          <Badge variant={permissions.isMaster ? 'default' : 'secondary'}>
            {permissions.userRole}
          </Badge>
        </div>
        <div className="text-muted-foreground text-sm">
          ID: {permissions.userId}
        </div>
        {permissions.userEstablishmentId && (
          <div className="text-muted-foreground text-sm">
            Establishment ID: {permissions.userEstablishmentId}
          </div>
        )}
        <div className="flex flex-wrap gap-1">
          <Badge
            variant="outline"
            className="text-xs"
          >
            {permissions.canManageAllEstablishments
              ? 'Gerencia Todos'
              : 'Gerencia Específico'}
          </Badge>
          <Badge
            variant="outline"
            className="text-xs"
          >
            {permissions.canViewProducts ? 'Pode Ver Produtos' : 'Não Pode Ver'}
          </Badge>
          <Badge
            variant="outline"
            className="text-xs"
          >
            {permissions.canManageProducts ? 'Pode Gerenciar' : 'Só Visualizar'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
