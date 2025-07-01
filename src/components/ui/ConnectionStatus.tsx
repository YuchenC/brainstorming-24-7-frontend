import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react"

interface ConnectionStatusProps {
  isConnected: boolean
  reconnecting?: boolean
}

export function ConnectionStatus({ isConnected, reconnecting }: ConnectionStatusProps) {
  if (reconnecting) {
    return (
      <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 px-3 py-1.5 rounded-md">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Reconnecting to WebSocket...</span>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-md">
        <AlertCircle className="w-4 h-4" />
        <span>WebSocket disconnected</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-md">
      <CheckCircle2 className="w-4 h-4" />
      <span>WebSocket connection live</span>
    </div>
  )
} 