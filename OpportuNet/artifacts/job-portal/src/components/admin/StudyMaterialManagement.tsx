import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCreateStudyMaterial, useUpdateStudyMaterial, useDeleteStudyMaterial } from "@/hooks/use-admin-mutations";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, AlertCircle } from "lucide-react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const apiFetch = (path: string, opts?: RequestInit) =>
  fetch(`${BASE}/api/admin${path}`, { credentials: "include", ...opts }).then(r => r.json());

interface StudyMaterial {
  id: number;
  examId: number;
  title: string;
  subject: string;
  type: "PDF" | "Video" | "Notes" | "Practice_Test";
  description: string;
  url: string;
  createdAt: string;
}

interface Exam {
  id: number;
  name: string;
  fullName: string;
}

export function StudyMaterialManagement() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    examId: "",
    title: "",
    subject: "",
    type: "PDF" as const,
    description: "",
    url: "",
  });

  const { data: materials = [] } = useQuery({
    queryKey: ["admin-study-materials"],
    queryFn: () => apiFetch("/study-materials"),
  });

  const { data: exams = [] } = useQuery({
    queryKey: ["admin-exams"],
    queryFn: () => apiFetch("/exams"),
  });

  const createMutation = useCreateStudyMaterial();
  const updateMutation = useUpdateStudyMaterial();
  const deleteMutation = useDeleteStudyMaterial();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      examId: parseInt(formData.examId),
    };
    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, data: submitData });
    } else {
      await createMutation.mutateAsync(submitData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      examId: "",
      title: "",
      subject: "",
      type: "PDF",
      description: "",
      url: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (material: StudyMaterial) => {
    setFormData({
      examId: material.examId.toString(),
      title: material.title,
      subject: material.subject,
      type: material.type,
      description: material.description,
      url: material.url,
    });
    setEditingId(material.id);
    setShowForm(true);
  };

  const getExamName = (examId: number) => {
    return exams.find((e: Exam) => e.id === examId)?.name || "Unknown Exam";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Study Materials Management</h2>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" /> Add Material
        </Button>
      </div>

      {showForm && (
        <div className="bg-card p-6 rounded-lg border border-border shadow-sm space-y-4">
          <h3 className="text-lg font-semibold">{editingId ? "Edit Material" : "Create New Material"}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={formData.examId}
                onChange={(e) => setFormData({ ...formData, examId: e.target.value })}
                className="px-3 py-2 border border-border rounded-lg"
                required
              >
                <option value="">Select Exam</option>
                {exams.map((exam: Exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.fullName}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Material Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="px-3 py-2 border border-border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="px-3 py-2 border border-border rounded-lg"
                required
              />
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="px-3 py-2 border border-border rounded-lg"
              >
                <option value="PDF">PDF</option>
                <option value="Video">Video</option>
                <option value="Notes">Notes</option>
                <option value="Practice_Test">Practice Test</option>
              </select>
              <input
                type="url"
                placeholder="Material URL"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="px-3 py-2 border border-border rounded-lg"
                required
              />
            </div>
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg"
              rows={3}
              required
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingId ? "Update" : "Create"} Material
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Exam</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Subject</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Type</th>
              <th className="px-6 py-3 text-right text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {materials.map((material: StudyMaterial) => (
              <tr key={material.id} className="hover:bg-secondary/50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium">{material.title}</td>
                <td className="px-6 py-4 text-sm">{getExamName(material.examId)}</td>
                <td className="px-6 py-4 text-sm">{material.subject}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                    {material.type.replace(/_/g, " ")}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(material)}
                      className="p-1 hover:bg-blue-100 rounded text-blue-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(material.id)}
                      className="p-1 hover:bg-red-100 rounded text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {materials.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            No study materials found
          </div>
        )}
      </div>
    </div>
  );
}
