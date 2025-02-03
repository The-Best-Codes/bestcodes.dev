import { type JSX, type ParentComponent, createMemo } from "solid-js";
import { cn } from "./lib/utils";

type ButtonVariant = "default" | "outline" | "ghost" | "link";
type ButtonSize = "default" | "sm" | "lg" | "icon";

type ButtonProps = JSX.HTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const Button: ParentComponent<ButtonProps> = (props) => {
  const variantClasses = createMemo(() => {
    switch (props.variant) {
      case "outline":
        return "bg-transparent border border-slate-200 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800";
      case "ghost":
        return "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800";
      case "link":
        return "bg-transparent underline-offset-4 hover:underline";
      default:
        return "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200";
    }
  });

  const sizeClasses = createMemo(() => {
    switch (props.size) {
      case "sm":
        return "px-2 py-1 text-sm rounded-md";
      case "lg":
        return "px-4 py-3 text-lg rounded-md";
      case "icon":
        return "h-9 w-9 p-1 rounded-md";
      default:
        return "px-3 py-2 rounded-md";
    }
  });

  return (
    <button
      ref={props.ref}
      class={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variantClasses(),
        sizeClasses(),
        props.class,
      )}
      {...props}
    >
      {props.children}
    </button>
  );
};

export { Button };
