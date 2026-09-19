"use client";

import type { PageElement, TextProps } from "@/lib/types";
import {
  ColorField,
  FieldGroup,
  NumberField,
  PanelSection,
  SelectField,
} from "@/components/ui/fields";
import SelfAlignmentFields from "./SelfAlignmentFields";
import { useProjectStore } from "@/store/projectsStore";

export default function TextProperties({ element }: { element: PageElement }) {
  const props = element.props as unknown as TextProps;
  const updateElementProps = useProjectStore((s) => s.updateElementProps);
  const set = (patch: Partial<TextProps>) =>
    updateElementProps(element.id, patch);

  return (
    <>
      <PanelSection title="Text">
      <p className="rounded-md bg-slate-50 px-2.5 py-2 text-xs text-slate-400">
        Tip: select the text, then click it again to edit the content directly on the canvas.
      </p>
      <FieldGroup>
        <NumberField
          label="Font size"
          value={props.fontSize}
          min={8}
          max={96}
          onChange={(v) => set({ fontSize: v })}
        />
        <SelectField
          label="Weight"
          value={props.fontWeight}
          onChange={(v) => set({ fontWeight: v })}
          options={[
            { value: "normal", label: "Normal" },
            { value: "medium", label: "Medium" },
            { value: "semibold", label: "Semibold" },
            { value: "bold", label: "Bold" },
          ]}
        />
      </FieldGroup>
      <SelectField
        label="Alignment"
        value={props.textAlign}
        onChange={(v) => set({ textAlign: v })}
        options={[
          { value: "left", label: "Left" },
          { value: "center", label: "Center" },
          { value: "right", label: "Right" },
          { value: "justify", label: "Justify" },
        ]}
      />
      <ColorField
        label="Color"
        value={props.color}
        onChange={(v) => set({ color: v })}
      />
      </PanelSection>
      <SelfAlignmentFields element={element} />
    </>
  );
}
