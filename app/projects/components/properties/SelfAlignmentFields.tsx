"use client";

import type { AlignSelf, JustifySelf, PageElement } from "@/lib/types";
import { PanelSection, SelectField } from "./propertiesFields";
import { useProjectStore } from "@/store/projectsStore";

export default function SelfAlignmentFields({
  element,
}: {
  element: PageElement;
}) {
  const props = element.props as {
    alignSelf?: AlignSelf;
    justifySelf?: JustifySelf;
  };
  const updateElementProps = useProjectStore((s) => s.actions.updateElementProps);

  return (
    <PanelSection title="Position in container">
      <p className="rounded-md bg-slate-50 px-2.5 py-2 text-xs text-slate-400">
        Overrides the parent&apos;s alignment for this one element only.
      </p>
      <SelectField
        label="Align self"
        value={props.alignSelf ?? "auto"}
        onChange={(v) => updateElementProps(element.id, { alignSelf: v })}
        options={[
          { value: "auto", label: "Auto (inherit)" },
          { value: "flex-start", label: "Start" },
          { value: "center", label: "Center" },
          { value: "flex-end", label: "End" },
          { value: "stretch", label: "Stretch" },
        ]}
      />
      <SelectField
        label="Justify self (grid only)"
        value={props.justifySelf ?? "auto"}
        onChange={(v) => updateElementProps(element.id, { justifySelf: v })}
        options={[
          { value: "auto", label: "Auto (inherit)" },
          { value: "start", label: "Start" },
          { value: "center", label: "Center" },
          { value: "end", label: "End" },
          { value: "stretch", label: "Stretch" },
        ]}
      />
    </PanelSection>
  );
}
