"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";
import type { ImageProps, PageElement } from "@/lib/types";
import { useProjectStore } from "@/store/projectsStore";

export default function ImageElement({
  element,
  selected,
}: {
  element: PageElement;
  selected: boolean;
}) {
  const props = element.props as unknown as ImageProps;
  const updateElementProps = useProjectStore((s) => s.actions.updateElementProps);
  const [broken, setBroken] = useState(false);
  const [editingUrl, setEditingUrl] = useState(false);

  return (
    <div
      className="relative"
      style={{ width: props.width != null ? `${props.width}%` : "100%" }}
      onPointerDown={(e) => {
        if (editingUrl) e.stopPropagation();
      }}
    >
      {props.src && !broken ? (
        <img
          src={props.src}
          alt={props.alt}
          onError={() => setBroken(true)}
          onLoad={() => setBroken(false)}
          className="block w-full"
          style={{
            height: props.height ? `${props.height}px` : "auto",
            objectFit: props.objectFit,
            borderRadius: props.borderRadius,
          }}
          draggable={false}
        />
      ) : (
        <div
          className="flex w-full flex-col items-center justify-center gap-2 bg-slate-100 text-slate-400"
          style={{
            height: props.height ? `${props.height}px` : 160,
            borderRadius: props.borderRadius,
          }}
        >
          <ImageOff size={22} />
          <span className="text-xs">Image not found</span>
        </div>
      )}

      {selected && (
        <div
          className="absolute -bottom-9 left-0 z-20 flex w-full items-center gap-1 rounded-md border border-slate-200 bg-white p-1 shadow-sm"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <input
            type="text"
            defaultValue={props.src}
            placeholder="Image URL"
            className="w-full rounded border-none bg-transparent px-1.5 py-1 text-xs text-slate-700 outline-none"
            onFocus={() => setEditingUrl(true)}
            onBlur={(e) => {
              setEditingUrl(false);
              if (e.target.value !== props.src) {
                setBroken(false);
                updateElementProps(element.id, { src: e.target.value });
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
            }}
          />
        </div>
      )}
    </div>
  );
}
