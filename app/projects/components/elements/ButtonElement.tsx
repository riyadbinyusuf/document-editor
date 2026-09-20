"use client";

import type { ButtonProps, PageElement, TypographyProps } from "@/lib/types";
import { useProjectStore } from "@/store/projectsStore";
import { findParentContainer } from "@/lib/tree";

export default function ButtonElement({
  element,
  selected,
}: {
  element: PageElement;
  selected: boolean;
}) {
  const elements = useProjectStore((s) => s.selectedPage.elements) ?? [];
  const parentContainer = findParentContainer(elements, element.id);
  const containerProps = parentContainer?.props as TypographyProps | undefined;

  const props = element.props as unknown as ButtonProps;
  const updateElementProps = useProjectStore((s) => s.updateElementProps);

  const resolvedFontFamily =
    props.fontFamily && props.fontFamily !== "inherit"
      ? props.fontFamily
      : containerProps?.fontFamily && containerProps.fontFamily !== "inherit"
        ? containerProps.fontFamily
        : undefined;

  const resolvedFontSize =
    props.fontSize != null
      ? props.fontSize
      : containerProps?.fontSize != null
        ? containerProps.fontSize
        : 14;

  const resolvedFontWeight =
    props.fontWeight
      ? props.fontWeight
      : containerProps?.fontWeight
        ? containerProps.fontWeight
        : "medium";

  const resolvedLineHeight =
    props.lineHeight != null
      ? props.lineHeight
      : containerProps?.lineHeight != null
        ? containerProps.lineHeight
        : undefined;

  const resolvedLetterSpacing =
    props.letterSpacing != null
      ? props.letterSpacing
      : containerProps?.letterSpacing != null
        ? containerProps.letterSpacing
        : undefined;

  const resolvedTextTransform =
    props.textTransform && props.textTransform !== "none"
      ? props.textTransform
      : containerProps?.textTransform && containerProps.textTransform !== "none"
        ? containerProps.textTransform
        : undefined;

  return (
    <span
      contentEditable={selected}
      suppressContentEditableWarning
      onPointerDown={(e) => {
        if (selected) e.stopPropagation();
      }}
      onBlur={(e) => {
        const label = e.currentTarget.textContent ?? "";
        if (label !== props.label) {
          updateElementProps(element.id, { label });
        }
      }}
      className="inline-block select-none"
      style={{
        backgroundColor: props.backgroundColor,
        color: props.textColor || props.color,
        fontFamily: resolvedFontFamily,
        fontSize: resolvedFontSize != null ? `${resolvedFontSize}px` : undefined,
        fontWeight:
          resolvedFontWeight === "normal"
            ? 400
            : resolvedFontWeight === "medium"
              ? 500
              : resolvedFontWeight === "semibold"
                ? 600
                : resolvedFontWeight === "bold"
                  ? 700
                  : undefined,
        lineHeight: resolvedLineHeight ?? undefined,
        letterSpacing: resolvedLetterSpacing != null ? `${resolvedLetterSpacing}px` : undefined,
        textTransform: resolvedTextTransform,
        borderRadius: props.borderRadius,
        padding: `${props.paddingY}px ${props.paddingX}px`,
      }}
    >
      {props.label}
    </span>
  );
}
