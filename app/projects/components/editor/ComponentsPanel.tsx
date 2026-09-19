import { Button } from "@/components/ui/button";
import { DRAGGABLE_ELEMENT_TYPES } from "@/lib/elementsRegistry";
import { Plus } from "lucide-react";
import React from "react";
import DraggableItem from "./DraggableItem";

function ComponentsPanel() {
  return (
    <div className="editor-left-panel w-[15%] h-full bg-primary-dark p-3 space-y-3">
      <div className="draggable-components-area">
        <h2 className="font-bold text-lg text-white">Components</h2>
        <div className="space-y-3">
          {DRAGGABLE_ELEMENT_TYPES.map((type) => (
            <DraggableItem key={type} type={type} />
          ))}
        </div>
      </div>
      <hr className="border-gray-700" />
      <div className="quick-components-area">
        <h2 className="font-bold text-lg text-white">Quick Components</h2>
      </div>
      <hr className="border-gray-700" />
      <div className="pages-area">
        <h2 className="font-bold text-lg text-white">Pages</h2>
        <div className="page-list"></div>
        <Button className="mt-2">
          <Plus /> Add Page
        </Button>
      </div>
    </div>
  );
}

export default ComponentsPanel;
