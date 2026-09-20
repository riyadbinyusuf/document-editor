"use client";

import { MousePointerClick, SlidersHorizontal } from "lucide-react";
import { findElement } from "@/lib/tree";
import { ReactElement } from "react";
import TextProperties from "@/app/projects/components/properties/TextProperties";
import ImageProperties from "@/app/projects/components/properties/ImageProperties";
import ButtonProperties from "@/app/projects/components/properties/ButtonProperties";
import ContainerProperties from "@/app/projects/components/properties/ContainerProperties";
import { useProjectStore } from "@/store/projectsStore";
import { ELEMENT_REGISTRY } from "@/lib/elementsRegistry";

export default function PropertiesPanel() {
  const elements = useProjectStore((s) => s.selectedPage.elements) ?? [];
  const selectedId = useProjectStore((s) => s.selectedElmId);
  const selected = selectedId ? findElement(elements, selectedId) : null;

  const def = selected ? ELEMENT_REGISTRY[selected.type] : null;
  const Icon = def?.icon ?? SlidersHorizontal;
  const title = def ? `${def.label} Settings` : "Properties";

  return (
    <aside className="thin-scroll flex w-full shrink-0 flex-col overflow-y-auto">
      <div className="border-b border-slate-200 px-4 pt-3.5 pb-0">
        {selected ? (
          <div className="flex items-center">
            <div className="inline-flex items-center gap-2 border-b-2 border-primary pb-2.5 text-sm font-medium text-primary -mb-px">
              <Icon className="size-4" />
              <span>{title}</span>
            </div>
          </div>
        ) : (
          <div className="pb-3 pt-0.5">
            <h2 className="text-sm font-semibold text-slate-800">Properties</h2>
            <p className="mt-0.5 text-xs text-slate-400">Nothing selected</p>
          </div>
        )}
      </div>

      {selected ? (
        <PropertiesFor element={selected} />
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-16 text-center text-slate-400">
          <MousePointerClick size={22} strokeWidth={1.5} />
          <p className="text-xs">
            Select an element on the canvas to edit its properties.
          </p>
        </div>
      )}
    </aside>
  );
}

function PropertiesFor({ element }: { element: NonNullable<ReturnType<typeof findElement>> }) {
  const settingsFor: Record<string, ReactElement> = {
    text: <TextProperties element={element} />,
    image: <ImageProperties element={element} />,
    button: <ButtonProperties element={element} />,
    container: <ContainerProperties element={element} />
  }

  return settingsFor[element.type] ?? null;
}

