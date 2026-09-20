"use client";

import type { FontWeight, PageElement, TextAlign, TextTransform, TypographyProps } from "@/lib/types";
import {
  ColorField,
  FieldGroup,
  NumberField,
  PanelSection,
  SelectField,
  TextAlignField,
} from "./propertiesFields";
import { useProjectStore } from "@/store/projectsStore";
import { findParentContainer } from "@/lib/tree";

interface TypographyFieldsProps {
  element: PageElement;
  colorKey?: "color" | "textColor";
  title?: string;
  hideAlignment?: boolean;
  allowInheritFont?: boolean;
}

const FONT_FAMILIES = [
  { value: "sans-serif", label: "Sans Serif" },
  { value: "serif", label: "Serif" },
  { value: "monospace", label: "Monospace" },
  { value: "Inter, sans-serif", label: "Inter" },
  { value: "Roboto, sans-serif", label: "Roboto" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: "Courier New, monospace", label: "Courier New" },
];

export default function TypographyFields({
  element,
  colorKey = "color",
  title = "Typography",
  hideAlignment = false,
  allowInheritFont = false,
}: TypographyFieldsProps) {
  const elements = useProjectStore((s) => s.selectedPage.elements) ?? [];
  const parentContainer = findParentContainer(elements, element.id);
  const containerProps = parentContainer?.props as TypographyProps | undefined;

  const props = element.props as unknown as TypographyProps & { textColor?: string };
  const updateElementProps = useProjectStore((s) => s.updateElementProps);

  const set = (patch: Record<string, unknown>) =>
    updateElementProps(element.id, patch);

  const isChildOfContainer = !!parentContainer;

  const hasChildTypographyOverride =
    isChildOfContainer &&
    (props.fontFamily != null && props.fontFamily !== "inherit" ||
      props.fontSize != null ||
      props.fontWeight != null && (props.fontWeight as string) !== "inherit" ||
      props.lineHeight != null ||
      props.letterSpacing != null ||
      props.textAlign != null && (props.textAlign as string) !== "inherit" ||
      props.textTransform != null && (props.textTransform as string) !== "inherit" ||
      (colorKey === "textColor" ? props.textColor != null : props.color != null));

  const resetToInherit = () => {
    updateElementProps(element.id, {
      fontFamily: undefined,
      fontSize: undefined,
      fontWeight: undefined,
      lineHeight: undefined,
      letterSpacing: undefined,
      textAlign: undefined,
      textTransform: undefined,
      [colorKey]: undefined,
    });
  };

  const containerFontLabel = containerProps?.fontFamily || "Default";
  const containerWeightLabel = containerProps?.fontWeight || "Regular";
  const containerTransformLabel = containerProps?.textTransform || "None";

  const fontOptions = isChildOfContainer || allowInheritFont
    ? [{ value: "inherit", label: `Inherit (${containerFontLabel})` }, ...FONT_FAMILIES]
    : FONT_FAMILIES;

  const weightOptions: { value: FontWeight | "inherit"; label: string }[] = isChildOfContainer
    ? [
        { value: "inherit", label: `Inherit (${containerWeightLabel})` },
        { value: "normal", label: "Normal (400)" },
        { value: "medium", label: "Medium (500)" },
        { value: "semibold", label: "Semibold (600)" },
        { value: "bold", label: "Bold (700)" },
      ]
    : [
        { value: "normal", label: "Normal (400)" },
        { value: "medium", label: "Medium (500)" },
        { value: "semibold", label: "Semibold (600)" },
        { value: "bold", label: "Bold (700)" },
      ];

  const currentAlign =
    (props.textAlign as string) ||
    (isChildOfContainer ? (containerProps?.textAlign || "left") : "left");

  const transformOptions: { value: TextTransform | "inherit"; label: string }[] = isChildOfContainer
    ? [
        { value: "inherit", label: `Inherit (${containerTransformLabel})` },
        { value: "none", label: "None" },
        { value: "uppercase", label: "UPPERCASE" },
        { value: "lowercase", label: "lowercase" },
        { value: "capitalize", label: "Capitalize" },
      ]
    : [
        { value: "none", label: "None" },
        { value: "uppercase", label: "UPPERCASE" },
        { value: "lowercase", label: "lowercase" },
        { value: "capitalize", label: "Capitalize" },
      ];

  // Resolved active color for display
  const currentColor =
    colorKey === "textColor"
      ? props.textColor ?? containerProps?.color ?? "#ffffff"
      : props.color ?? containerProps?.color ?? (element.type === "container" ? "" : "#1e293b");

  return (
    <PanelSection title={title}>
      {isChildOfContainer && (
        <div className="flex items-center justify-between rounded-sm bg-muted/40 px-2.5 py-1.5 text-xs text-muted-foreground">
          <span>
            {hasChildTypographyOverride
              ? "Custom typography set"
              : "Inheriting all from container"}
          </span>
          {hasChildTypographyOverride && (
            <button
              type="button"
              onClick={resetToInherit}
              className="text-[11px] font-medium text-primary hover:underline"
            >
              Reset to inherit
            </button>
          )}
        </div>
      )}

      <SelectField
        label="Font Family"
        value={props.fontFamily || (isChildOfContainer || allowInheritFont ? "inherit" : "sans-serif")}
        onChange={(fontFamily) => set({ fontFamily: fontFamily === "inherit" ? undefined : fontFamily })}
        options={fontOptions}
      />

      <FieldGroup>
        <NumberField
          label="Font size (px)"
          value={props.fontSize ?? (containerProps?.fontSize ?? (element.type === "button" ? 14 : 16))}
          min={8}
          max={120}
          onChange={(fontSize) => set({ fontSize })}
        />
        <SelectField
          label="Weight"
          value={(props.fontWeight as string) || (isChildOfContainer ? "inherit" : "normal")}
          onChange={(fontWeight) =>
            set({ fontWeight: fontWeight === "inherit" ? undefined : fontWeight })
          }
          options={weightOptions}
        />
      </FieldGroup>

      <FieldGroup>
        <NumberField
          label="Line height"
          value={props.lineHeight ?? (containerProps?.lineHeight ?? 1.5)}
          step={0.1}
          min={0.5}
          max={3}
          onChange={(lineHeight) => set({ lineHeight })}
        />
        <NumberField
          label="Letter spacing (px)"
          value={props.letterSpacing ?? (containerProps?.letterSpacing ?? 0)}
          step={0.5}
          min={-5}
          max={20}
          onChange={(letterSpacing) => set({ letterSpacing })}
        />
      </FieldGroup>

      <FieldGroup>
        {!hideAlignment && (
          <TextAlignField
            label="Alignment"
            value={currentAlign}
            onChange={(align) => {
              if (isChildOfContainer && props.textAlign === align) {
                set({ textAlign: undefined });
              } else {
                set({ textAlign: align });
              }
            }}
          />
        )}
        <SelectField
          label="Transform"
          value={(props.textTransform as string) || (isChildOfContainer ? "inherit" : "none")}
          onChange={(textTransform) =>
            set({ textTransform: textTransform === "inherit" ? undefined : textTransform })
          }
          options={transformOptions}
        />
      </FieldGroup>

      <ColorField
        label="Text Color"
        value={currentColor || "#1e293b"}
        onChange={(v) => set({ [colorKey]: v })}
      />
    </PanelSection>
  );
}
