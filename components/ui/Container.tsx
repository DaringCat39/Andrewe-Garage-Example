import { type ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer" | "nav" | "article";
  id?: string;
  ariaLabel?: string;
};

export function Container({
  children,
  className = "",
  as: Tag = "div",
  id,
  ariaLabel,
}: ContainerProps) {
  return (
    <Tag
      id={id}
      aria-label={ariaLabel}
      className={`mx-auto w-full max-w-[80rem] px-5 sm:px-6 lg:px-8 ${className}`}
    >
      {children}
    </Tag>
  );
}
