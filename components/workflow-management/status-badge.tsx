import { Badge } from "@/components/ui/badge";
import { WorkflowStatus, getStatusLabel, getStatusColor } from "./types";

interface StatusBadgeProps {
  status: WorkflowStatus;
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  return (
    <Badge className={`${getStatusColor(status)} ${className}`}>
      {getStatusLabel(status)}
    </Badge>
  );
}

