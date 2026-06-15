import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { ItemForm } from "./admin.menu.new";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/menu/$id")({
  component: EditItem,
});

function EditItem() {
  const { id } = Route.useParams();
  const existing = useStore((s) => s.items.find((i) => i.id === id));
  const saveItem = useStore((s) => s.saveItem);
  const navigate = useNavigate();
  const [item, setItem] = useState(existing);

  useEffect(() => { setItem(existing); }, [existing]);

  if (!item) {
    return (
      <div className="p-10">
        <p>Item not found.</p>
        <Link to="/admin/menu" className="text-brand underline">Back</Link>
      </div>
    );
  }

  return (
    <ItemForm
      item={item}
      onChange={setItem}
      onSave={() => { saveItem(item); toast.success("Saved"); navigate({ to: "/admin/menu" }); }}
      title={`Edit ${item.name}`}
    />
  );
}
