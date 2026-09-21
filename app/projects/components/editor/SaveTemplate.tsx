import { Button } from "@/components/ui/button";
import { generateId } from "@/lib/id";
import { useProjectStore } from "@/store/projectsStore";
import { useTemplateStore } from "@/store/templateStore";
import {
  Delete,
  EllipsisVertical,
  File,
  FolderOpen,
  Plus,
  Save,
} from "lucide-react";

function SaveTemplate() {
  const templates = useTemplateStore((state) => state.context.templates);
  const saveTemplate = useTemplateStore((state) => state.actions.saveTemplate);
  const removeTemplate = useTemplateStore(
    (state) => state.actions.removeTemplate,
  );
  const loadTemplate = useProjectStore((state) => state.actions.loadTemplate);
  const handleSaveTemplate = () => {
    const currentTemplate = useProjectStore.getState().context;
    saveTemplate({
      ...currentTemplate,
      created_at: Date.now(),
      templateId: generateId("template"),
      templateName: "Template-1",
    });
  };

  return (
    <div className="ml-4 p-4 border rounded min-h-0 overflow-auto space-y-3">
      <div className="heading flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="">
            {" "}
            <FolderOpen className="text-primary" />{" "}
          </div>
          <div className="">
            <h2 className="text-base font-medium">Save Templates</h2>
            <p className="text-sm font-light text-gray-500">
              Access and manage your saved templates
            </p>
          </div>
        </div>
        <Button
          variant="outline_primay"
          type="button"
          onClick={handleSaveTemplate}
        >
          {" "}
          <Plus /> Save current as Template{" "}
        </Button>
      </div>
      <div className="save-template-list space-y-2">
        {templates.map((template) => {
          return (
            <div
              key={template.templateId}
              className="st-card bg-white rounded px-3 py-2 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <div className="">
                  {" "}
                  <Save className="text-primary" />{" "}
                </div>
                <div className="">
                  <h3 className="text-sm">{template.templateName}</h3>
                  <p className="text-xs font-light text-gray-500">
                    Saved on 2026-09-14 | 10:32 AM
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline_primay"
                  type="button"
                  onClick={() => loadTemplate(template)}
                >
                  {" "}
                  <File /> Open
                </Button>
                <Button
                  variant="outline_primay"
                  type="button"
                  onClick={() => removeTemplate(template.templateId)}
                >
                  {" "}
                  <Delete /> Delete
                </Button>
                <Button variant="outline">
                  <EllipsisVertical />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SaveTemplate;
