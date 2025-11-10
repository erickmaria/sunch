import { Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"

type Props = {
    size?: number | string;
};


function Spinner({ size = 24, className, ...props }: React.ComponentProps<"svg"> & Props) {
  return (
    <Loader2Icon
      size={size}
      role="status"
      aria-label="Loading"
      className={cn("animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }
