"use client";

import type { ContainerProps, PageElement, SizeUnit } from "@/lib/types";
import {
  ColorField,
  FieldGroup,
  NumberField,
  PanelSection,
  SelectField,
  SizeUnitField,
} from "./propertiesFields";
import { useProjectStore } from "@/store/projectsStore";
import SelfAlignmentFields from "./SelfAlignmentFields";
import TypographyFields from "./TypographyFields";

export default function ContainerProperties({
  element,
}: {
  element: PageElement;
}) {
  const props = element.props as unknown as ContainerProps;
  const isGrid = props.layoutMode === "grid";
  const updateElementProps = useProjectStore((s) => s.updateElementProps);
  const set = (patch: Partial<ContainerProps>) =>
    updateElementProps(element.id, patch);

  return (
    <>
      <PanelSection title="Dimensions">
        <SizeUnitField
          label="Width"
          value={props.width ?? 100}
          unit={props.widthUnit ?? "%"}
          onValueChange={(width) => set({ width })}
          onUnitChange={(widthUnit) =>
            set({ widthUnit: widthUnit as SizeUnit })
          }
          units={["%", "px", "auto"]}
        />

        <SizeUnitField
          label="Height"
          value={props.height}
          unit={props.heightUnit ?? "auto"}
          onValueChange={(height) => set({ height })}
          onUnitChange={(heightUnit) =>
            set({ heightUnit: heightUnit as SizeUnit })
          }
          units={["auto", "px", "%"]}
        />

        <SizeUnitField
          label="Min Height"
          value={props.minHeight ?? 80}
          unit={props.minHeightUnit ?? "px"}
          onValueChange={(minHeight) => set({ minHeight })}
          onUnitChange={(minHeightUnit) =>
            set({ minHeightUnit: minHeightUnit as "px" | "%" })
          }
          units={["px", "%"]}
        />
      </PanelSection>

      <PanelSection title="Layout">
        <SelectField
          label="Mode"
          value={props.layoutMode}
          onChange={(v) => set({ layoutMode: v })}
          options={[
            { value: "flex", label: "Flex" },
            { value: "grid", label: "Grid" },
          ]}
        />

        {isGrid ? (
          <FieldGroup>
            <NumberField
              label="Columns"
              value={props.gridColumns}
              min={1}
              max={12}
              onChange={(v) => set({ gridColumns: v })}
            />
            <NumberField
              label="Gap (px)"
              value={props.gap}
              min={0}
              max={100}
              onChange={(v) => set({ gap: v })}
            />
          </FieldGroup>
        ) : (
          <FieldGroup>
            <SelectField
              label="Direction"
              value={props.direction}
              onChange={(v) => set({ direction: v })}
              options={[
                { value: "column", label: "Column" },
                { value: "row", label: "Row" },
              ]}
            />
            <NumberField
              label="Gap (px)"
              value={props.gap}
              min={0}
              max={100}
              onChange={(v) => set({ gap: v })}
            />
          </FieldGroup>
        )}

        <FieldGroup>
          {isGrid ? (
            <SelectField
              label="Justify items"
              value={props.justifyItems}
              onChange={(v) => set({ justifyItems: v })}
              options={[
                { value: "start", label: "Start" },
                { value: "center", label: "Center" },
                { value: "end", label: "End" },
                { value: "stretch", label: "Stretch" },
              ]}
            />
          ) : (
            <SelectField
              label="Justify content"
              value={props.justifyContent}
              onChange={(v) => set({ justifyContent: v })}
              options={[
                { value: "flex-start", label: "Start" },
                { value: "center", label: "Center" },
                { value: "flex-end", label: "End" },
                { value: "space-between", label: "Space between" },
              ]}
            />
          )}
          <SelectField
            label="Align items"
            value={props.alignItems}
            onChange={(v) => set({ alignItems: v })}
            options={[
              { value: "flex-start", label: "Start" },
              { value: "center", label: "Center" },
              { value: "flex-end", label: "End" },
              { value: "stretch", label: "Stretch" },
            ]}
          />
        </FieldGroup>
      </PanelSection>

      <PanelSection title="Appearance">
        <NumberField
          label="Padding (px)"
          value={props.padding}
          min={0}
          max={120}
          onChange={(v) => set({ padding: v })}
        />
        <ColorField
          label="Background"
          value={
            props.backgroundColor === "transparent"
              ? "#ffffff"
              : props.backgroundColor
          }
          onChange={(v) => set({ backgroundColor: v })}
        />
      </PanelSection>

      <TypographyFields element={element} allowInheritFont />

      <SelfAlignmentFields element={element} />
    </>
  );
}
