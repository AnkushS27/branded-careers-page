"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { PageSection } from "@/lib/types"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Trash2 } from "lucide-react"

interface SectionsManagerProps {
  companyId: string
}

interface SortableSectionProps {
  section: PageSection
  onDelete: (id: string) => void
}

function SortableSection({ section, onDelete }: SortableSectionProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="p-4 border border-border rounded bg-background flex items-start gap-3">
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing mt-1">
        <GripVertical className="w-5 h-5 text-muted-foreground" />
      </button>
      <div className="flex-1">
        <h4 className="font-semibold">{section.section_title}</h4>
        <p className="text-sm text-muted mt-1 line-clamp-2">{section.section_content}</p>
      </div>
      <Button variant="ghost" size="sm" onClick={() => onDelete(section.id)} className="shrink-0">
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  )
}

export default function SectionsManager({ companyId }: SectionsManagerProps) {
  const [sections, setSections] = useState<PageSection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    fetchSections()
  }, [companyId])

  const fetchSections = async () => {
    try {
      const response = await fetch(`/api/page-sections?company_id=${companyId}`)
      if (response.ok) {
        const data = await response.json()
        setSections(data)
      }
    } catch (error) {
      console.error("Error fetching sections:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!formData.title) return

    try {
      const response = await fetch("/api/page-sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_id: companyId,
          section_type: "custom",
          section_title: formData.title,
          section_content: formData.content,
          section_order: sections.length,
          is_visible: true,
        }),
      })

      if (response.ok) {
        setFormData({ title: "", content: "" })
        fetchSections()
      }
    } catch (error) {
      console.error("Error adding section:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this section?")) return

    try {
      await fetch(`/api/page-sections/${id}`, { method: "DELETE" })
      fetchSections()
    } catch (error) {
      console.error("Error deleting section:", error)
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const oldIndex = sections.findIndex((s) => s.id === active.id)
    const newIndex = sections.findIndex((s) => s.id === over.id)

    const newSections = arrayMove(sections, oldIndex, newIndex)
    setSections(newSections)

    // Update section_order for all affected sections
    try {
      const updatePromises = newSections.map((section, index) =>
        fetch(`/api/page-sections/${section.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            section_order: index,
          }),
        })
      )
      await Promise.all(updatePromises)
    } catch (error) {
      console.error("Error updating section order:", error)
      fetchSections() // Revert on error
    }
  }

  if (isLoading) {
    return <p className="text-muted">Loading sections...</p>
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Add Section Form */}
      <div className="p-6 bg-secondary rounded border border-border h-fit">
        <h3 className="text-lg font-semibold mb-4">Add New Section</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="section-title">Title</Label>
            <Input
              id="section-title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Why Join Us?"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="section-content">Content</Label>
            <Textarea
              id="section-content"
              value={formData.content}
              onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
              placeholder="Section content..."
              rows={4}
            />
          </div>

          <Button onClick={handleAdd} disabled={!formData.title}>
            Add Section
          </Button>
        </div>
      </div>

      {/* Sections List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Existing Sections ({sections.length})</h3>
        {sections.length === 0 ? (
          <p className="text-muted text-center py-8 border border-dashed border-border rounded">
            No sections yet. Add one to get started!
          </p>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {sections.map((section) => (
                  <SortableSection key={section.id} section={section} onDelete={handleDelete} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  )
}
