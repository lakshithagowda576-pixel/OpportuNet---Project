import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCreateExam, useUpdateExam, useDeleteExam } from "@/hooks/use-admin-mutations";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, AlertCircle } from "lucide-react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const apiFetch = (path: string, opts?: RequestInit) =>
  fetch(`${BASE}/api/admin${path}`, { credentials: "include", ...opts }).then(r => r.json());

interface Exam {
  id: number;
  name: string;
  fullName: string;
  description: string;
  examDate: string;
  applicationStartDate: string;
  applicationEndDate: string;
  applyLink: string;
  eligibility: string;
  applicationGuide: string;
  officialWebsite: string;
  createdAt: string;
}

export function ExamManagement() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    fullName: "",
    description: "",
    examDate: "",
    applicationStartDate: "",
    applicationEndDate: "",
    applyLink: "",
    eligibility: "",
    applicationGuide: "",
    officialWebsite: "",
  });

  const { data: exams = [] } = useQuery({
    queryKey: ["admin-exams"],
    queryFn: () => apiFetch("/exams"),
  });

  const createMutation = useCreateExam();
  const updateMutation = useUpdateExam();
  const deleteMutation = useDeleteExam();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, data: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      fullName: "",
      description: "",
      examDate: "",
      applicationStartDate: "",
      applicationEndDate: "",
      applyLink: "",
      eligibility: "",
      applicationGuide: "",
      officialWebsite: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (exam: Exam) => {
    setFormData({
      name: exam.name,
      fullName: exam.fullName,
      description: exam.description,
      examDate: exam.examDate,
      applicationStartDate: exam.applicationStartDate,
      applicationEndDate: exam.applicationEndDate,
      applyLink: exam.applyLink,
      eligibility: exam.eligibility,
      applicationGuide: exam.applicationGuide,
      officialWebsite: exam.officialWebsite,
    });
    setEditingId(exam.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Exams Management</h2>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" /> Add Exam
        </Button>
      </div>

      {showForm && (
        <div className="bg-card p-6 rounded-lg border border-border shadow-sm space-y-4">
          <h3 className="text-lg font-semibold">{editingId ? "Edit Exam" : "Create New Exam"}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Exam Short Name (e.g., SSC, UPSC)"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-3 py-2 border border-border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Full Exam Name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="px-3 py-2 border border-border rounded-lg"
                required
              />
              <input
                type="datetime-local"
                placeholder="Exam Date"
                value={formData.examDate}
                onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                className="px-3 py-2 border border-border rounded-lg"
                required
              />
              <input
                type="datetime-local"
                placeholder="Application Start Date"
                value={formData.applicationStartDate}
                onChange={(e) => setFormData({ ...formData, applicationStartDate: e.target.value })}
                className="px-3 py-2 border border-border rounded-lg"
                required
              />
              <input
                type="datetime-local"
                placeholder="Application End Date"
                value={formData.applicationEndDate}
                onChange={(e) => setFormData({ ...formData, applicationEndDate: e.target.value })}
                className="px-3 py-2 border border-border rounded-lg"
                required
              />
              <input
                type="url"
                placeholder="Official Website"
                value={formData.officialWebsite}
                onChange={(e) => setFormData({ ...formData, officialWebsite: e.target.value })}
                className="px-3 py-2 border border-border rounded-lg"
                required
              />
              <input
                type="url"
                placeholder="Application Link"
                value={formData.applyLink}
                onChange={(e) => setFormData({ ...formData, applyLink: e.target.value })}
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
            <textarea
              placeholder="Eligibility Criteria"
              value={formData.eligibility}
              onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg"
              rows={2}
              required
            />
            <textarea
              placeholder="Application Guide"
              value={formData.applicationGuide}
              onChange={(e) => setFormData({ ...formData, applicationGuide: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg"
              rows={2}
              required
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingId ? "Update" : "Create"} Exam
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
              <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Full Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Exam Date</th>
              <th className="px-6 py-3 text-right text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {exams.map((exam: Exam) => (
              <tr key={exam.id} className="hover:bg-secondary/50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium">{exam.name}</td>
                <td className="px-6 py-4 text-sm">{exam.fullName}</td>
                <td className="px-6 py-4 text-sm">{new Date(exam.examDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(exam)}
                      className="p-1 hover:bg-blue-100 rounded text-blue-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(exam.id)}
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
        {exams.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            No exams found
          </div>
        )}
      </div>
    </div>
  );
}
