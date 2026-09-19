"use client";

import type { ButtonProps, PageElement } from "@/lib/types";
import {
  ColorField,
  FieldGroup,
  NumberField,
  PanelSection,
  TextField,
} from "@/components/ui/fields";
import SelfAlignmentFields from "./SelfAlignmentFields";
import { useProjectStore } from "@/store/projectsStore";

export default function ButtonProperties({ element }: { element: PageElement }) {
  const props = element.props as unknown as ButtonProps;
  const updateElementProps = useProjectStore((s) => s.updateElementProps);
  const set = (patch: Partial<ButtonProps>) =>
    updateElementProps(element.id, patch);

  return (
    <>
      <PanelSection title="Button">
      <p className="rounded-md bg-slate-50 px-2.5 py-2 text-xs text-slate-400">
        Tip: select the button, then click its label to edit the text directly.
      </p>
      <TextField
        label="Label"
        value={props.label}
        onChange={(v) => set({ label: v })}
      />
      <TextField
        label="Link (href)"
        value={props.href}
        placeholder="https:// or #section"
        onChange={(v) => set({ href: v })}
      />
      <FieldGroup>
        <ColorField
          label="Background"
          value={props.backgroundColor}
          onChange={(v) => set({ backgroundColor: v })}
        />
        <ColorField
          label="Text color"
          value={props.textColor}
          onChange={(v) => set({ textColor: v })}
        />
      </FieldGroup>
      <FieldGroup>
        <NumberField
          label="Font size"
          value={props.fontSize}
          min={8}
          max={48}
          onChange={(v) => set({ fontSize: v })}
        />
        <NumberField
          label="Radius"
          value={props.borderRadius}
          min={0}
          max={100}
          onChange={(v) => set({ borderRadius: v })}
        />
      </FieldGroup>
      <FieldGroup>
        <NumberField
          label="Padding X"
          value={props.paddingX}
          min={0}
          max={80}
          onChange={(v) => set({ paddingX: v })}
        />
        <NumberField
          label="Padding Y"
          value={props.paddingY}
          min={0}
          max={80}
          onChange={(v) => set({ paddingY: v })}
        />
      </FieldGroup>
      </PanelSection>
      <SelfAlignmentFields element={element} />
    </>
  );
}
