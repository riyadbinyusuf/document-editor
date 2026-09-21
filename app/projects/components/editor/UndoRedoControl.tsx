import { useStore } from "zustand";
import { useProjectStore } from "@/store/projectsStore";
import { Button } from "@/components/ui/button";
import { Undo, Redo } from "lucide-react";

export default function UndoRedoControls() {
  const { undo, redo } = useProjectStore.temporal.getState();
  const canUndo = useStore(useProjectStore.temporal, (s) => s.pastStates.length > 0);
  const canRedo = useStore(useProjectStore.temporal, (s) => s.futureStates.length > 0);

  return (
    <div className="flex items-center space-x-1">
      <Button
        variant="ghost"
        onClick={() => undo()}
        disabled={!canUndo}
        title="Undo (Ctrl+Z)"
      >
        <Undo />
      </Button>

      <Button
        variant="ghost"
        onClick={() => redo()}
        disabled={!canRedo}
        title="Redo (Ctrl+Y)"
      >
        <Redo />
      </Button>
    </div>
  );
}