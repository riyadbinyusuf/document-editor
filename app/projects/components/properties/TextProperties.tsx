"use client";

import type { PageElement, TypographyProps } from "@/lib/types";
import SelfAlignmentFields from "./SelfAlignmentFields";
import TypographyFields from "./TypographyFields";

export default function TextProperties({ element, containerProps }: { element: PageElement, containerProps?: TypographyProps }) {

  return (
    <>
      <div className="px-4 pt-3">
        <p className="rounded-sm bg-muted/50 px-2.5 py-2 text-xs text-muted-foreground">
          Tip: select the text, then click it again to edit the content directly on the canvas.
        </p>
      </div>
      <TypographyFields element={element} containerProps={containerProps} />
      <SelfAlignmentFields element={element} />
    </>
  );
}
