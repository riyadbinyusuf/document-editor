"use client";

import { forwardRef, type ReactNode, Ref } from "react";
import type { ContainerProps, PageElement } from "@/lib/types";

export default function ContainerElement({
  element,
  children,
  isOver,
  ref,
}: {
  element: PageElement;
  children?: ReactNode;
  isOver?: boolean;
  ref?: Ref<HTMLDivElement>;
}) {
  const props = element.props as unknown as ContainerProps;

  return (
    <div
      ref={ref}
      className="w-full transition-shadow"
      style={{
        display: "flex",
        flexDirection: props.direction,
        gap: props.gap,
        padding: props.padding,
        backgroundColor: props.backgroundColor,
        justifyContent: props.justifyContent,
        alignItems: props.alignItems,
        minHeight: props.minHeight,
        boxShadow: isOver ? "inset 0 0 0 2px #4C5BD4" : undefined,
      }}
    >
      {children}
    </div>
  );
}
