import { Spinner } from "@/components/ui/spinner";
import colors from "tailwindcss/colors";

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner className="h-20 w-20" color={colors.gray[500]} />
    </div>
  );
}

export default Loading;
