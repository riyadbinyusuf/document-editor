"use client";

import type { ImageProps, PageElement } from "@/lib/types";
import {
  FieldGroup,
  NumberField,
  PanelSection,
  SelectField,
  TextField,
} from "@/components/ui/fields";
import SelfAlignmentFields from "./SelfAlignmentFields";
import { useProjectStore } from "@/store/projectsStore";

export default function ImageProperties({ element }: { element: PageElement }) {
  const props = element.props as unknown as ImageProps;
  const updateElementProps = useProjectStore((s) => s.updateElementProps);
  const set = (patch: Partial<ImageProps>) =>
    updateElementProps(element.id, patch);

  return (
    <>
      <PanelSection title="Image">
      <TextField
        label="Image URL"
        value={props.src}
        placeholder="https://…"
        onChange={(v) => set({ src: v })}
      />
      <TextField
        label="Alt text"
        value={props.alt}
        placeholder="Describe the image"
        onChange={(v) => set({ alt: v })}
      />
      <FieldGroup>
        <NumberField
          label="Width (%)"
          value={props.width}
          min={5}
          max={100}
          onChange={(v) => set({ width: v })}
        />
        <NumberField
          label="Height (px)"
          value={props.height}
          min={0}
          max={1200}
          onChange={(v) => set({ height: v })}
        />
      </FieldGroup>
      <FieldGroup>
        <SelectField
          label="Fit"
          value={props.objectFit}
          onChange={(v) => set({ objectFit: v })}
          options={[
            { value: "cover", label: "Cover" },
            { value: "contain", label: "Contain" },
            { value: "fill", label: "Fill" },
            { value: "none", label: "None" },
          ]}
        />
        <NumberField
          label="Radius"
          value={props.borderRadius}
          min={0}
          max={200}
          onChange={(v) => set({ borderRadius: v })}
        />
      </FieldGroup>
      </PanelSection>
      <SelfAlignmentFields element={element} />
    </>
  );
}
