"use client";

import { type ReactNode, Ref, useMemo } from "react";
import type { ContainerProps, PageElement } from "@/lib/types";
import { ContainerTypographyContext } from "./ContainerTypographyContext";

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
  const isGrid = props.layoutMode === "grid";

  const widthStyle =
    props.widthUnit === "auto"
      ? "auto"
      : props.width != null
        ? `${props.width}${props.widthUnit ?? "%"}`
        : "100%";

  const heightStyle =
    props.heightUnit === "auto" || props.height == null
      ? undefined
      : `${props.height}${props.heightUnit ?? "px"}`;

  const minHeightStyle =
    props.minHeight != null
      ? `${props.minHeight}${props.minHeightUnit ?? "px"}`
      : undefined;

  const contextValue = useMemo(
    () => ({ isInsideContainer: true, typography: props }),
    [props],
  );

  return (
    <ContainerTypographyContext.Provider value={contextValue}>
      <div
        ref={ref}
        className="transition-all"
        style={{
          width: widthStyle,
          height: heightStyle,
          minHeight: minHeightStyle ?? "40px",
          display: isGrid ? "grid" : "flex",
          flexDirection: isGrid ? undefined : props.direction,
          gridTemplateColumns: isGrid
            ? `repeat(${props.gridColumns ?? 3}, minmax(0, 1fr))`
            : undefined,
          justifyItems: isGrid ? props.justifyItems : undefined,
          gap: props.gap,
          padding: props.padding != null ? `${props.padding}px` : "8px",
          backgroundColor: props.backgroundColor,
          justifyContent: isGrid ? undefined : props.justifyContent,
          alignItems: props.alignItems,
          boxShadow: isOver ? "inset 0 0 0 2px #4C5BD4" : undefined,
          fontFamily:
            props.fontFamily && props.fontFamily !== "inherit"
              ? props.fontFamily
              : undefined,
          fontSize: props.fontSize ? `${props.fontSize}px` : undefined,
          fontWeight:
            props.fontWeight === "normal"
              ? 400
              : props.fontWeight === "medium"
                ? 500
                : props.fontWeight === "semibold"
                  ? 600
                  : props.fontWeight === "bold"
                    ? 700
                    : undefined,
          lineHeight: props.lineHeight ?? undefined,
          letterSpacing:
            props.letterSpacing != null
              ? `${props.letterSpacing}px`
              : undefined,
          textAlign: props.textAlign,
          textTransform:
            props.textTransform && props.textTransform !== "none"
              ? props.textTransform
              : undefined,
          color: props.color || undefined,
        }}
      >
        {children}
      </div>
    </ContainerTypographyContext.Provider>
  );
}
