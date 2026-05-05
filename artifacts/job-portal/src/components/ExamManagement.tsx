import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCreateExam, useUpdateExam, useDeleteExam, useCreateStudyMaterial, useUpdateStudyMaterial, useDeleteStudyMaterial } from "@/hooks/useAdminMutations";
import { CreateExamInput, UpdateExamInput, CreateStudyMaterialInput, UpdateStudyMaterialInput } from "@workspace/api-zod";
import { Plus, Edit, Trash2, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const apiFetch = (path: string) =>
  fetch(`${BASE}/api/admin${path}`, { credentials: "include" }).then(r => r.json());

export function ExamManagement() {
  const { toast } = useToast();
  const { data: exams = [], isLoading } = useQuery({
    queryKey: ["admin-exams"],
    queryFn: () => apiFetch("/exams"),
  });

  const createExamMut = useCreateExam();
  const updateExamMut = useUpdateExam();
  const deleteExamMut = useDeleteExam();
  const createMaterialMut = useCreateStudyMaterial();
  const updateMaterialMut = useUpdateStudyMaterial();
  const deleteMaterialMut = useDeleteStudyMaterial();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<CreateExamInput>>({});
  const [showMaterialForm, setShowMaterialForm] = useState<number | null>(null);
  const [materialData, setMaterialData] = useState<Partial<CreateStudyMaterialInput>>({});
  const [editingMaterialId, setEditingMaterialId] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        updateExamMut.mutate({ id: editingId, data: formData as UpdateExamInput }, {
          onSuccess: () => {
            setFormData({});
            setEditingId(null);
            setShowForm(false);
          },
        });
      } else {
        createExamMut.mutate(formData as CreateExamInput, {
          onSuccess: () => {
            setFormData({});
            setShowForm(false);
          },
        });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleMaterialSubmit = (examId: number) => {
    if (editingMaterialId) {
      updateMaterialMut.mutate({ id: editingMaterialId, data: materialData as UpdateStudyMaterialInput }, {
        onSuccess: () => {
          setMaterialData({});
          setEditingMaterialId(null);
          setShowMaterialForm(null);
        },
      });
    } else {
      createMaterialMut.mutate({ examId, ...materialData } as CreateStudyMaterialInput, {
        onSuccess: () => {
          setMaterialData({});
          setShowMaterialForm(null);
        },
      });
    }
  };

  const handleEdit = (exam: any) => {
    setEditingId(exam.id);
    setFormData(exam);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this exam and all its study materials?")) {
      deleteExamMut.mutate(id);
    }
  };

  if (isLoading) return <div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Manage Exams</h3>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({}); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" /> Add Exam
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-50 p-6 rounded-lg border border-slate-200 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Short Name" value={formData.name || ""} onChange={e => setFormData({ ...formData, name: e.target.value })} className="px-3 py-2 border rounded-lg" required />
            <input type="text" placeholder="Full Name" value={formData.fullName || ""} onChange={e => setFormData({ ...formData, fullName: e.target.value })} className="px-3 py-2 border rounded-lg" required />
            <input type="date" value={formData.examDate || ""} onChange={e => setFormData({ ...formData, examDate: e.target.value })} className="px-3 py-2 border rounded-lg" required />
            <input type="date" value={formData.applicationStartDate || ""} onChange={e => setFormData({ ...formData, applicationStartDate: e.target.value })} className="px-3 py-2 border rounded-lg" required />
            <input type="date" value={formData.applicationEndDate || ""} onChange={e => setFormData({ ...formData, applicationEndDate: e.target.value })} className="px-3 py-2 border rounded-lg" required />
            <input type="url" placeholder="Apply Link" value={formData.applyLink || ""} onChange={e => setFormData({ ...formData, applyLink: e.target.value })} className="px-3 py-2 border rounded-lg" required />
            <input type="url" placeholder="Official Website" value={formData.officialWebsite || ""} onChange={e => setFormData({ ...formData, officialWebsite: e.target.value })} className="px-3 py-2 border rounded-lg" required />
          </div>
          <textarea placeholder="Description" value={formData.description || ""} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={3} required />
          <textarea placeholder="Eligibility Criteria" value={formData.eligibility || ""} onChange={e => setFormData({ ...formData, eligibility: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={3} required />
          <textarea placeholder="Application Guide" value={formData.applicationGuide || ""} onChange={e => setFormData({ ...formData, applicationGuide: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={3} required />
          <div className="flex gap-2">
            <button type="submit" disabled={createExamMut.isPending || updateExamMut.isPending} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
              {createExamMut.isPending || updateExamMut.isPending ? "Saving..." : editingId ? "Update Exam" : "Create Exam"}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setFormData({}); setEditingId(null); }} className="flex-1 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid gap-3">
        {exams.map((exam: any) => (
          <div key={exam.id} className="bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition">
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 cursor-pointer" onClick={() => setExpandedId(expandedId === exam.id ? null : exam.id)}>
                  <div className="flex items-center gap-2">
                    {expandedId === exam.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    <h4 className="font-semibold text-blue-600">{exam.fullName}</h4>
                  </div>
                  <p className="text-sm text-gray-600 ml-6">{exam.name}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(exam)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(exam.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 ml-6 mb-2">
                <p>Exam: {new Date(exam.examDate).toLocaleDateString()}</p>
                <p>Apply: {new Date(exam.applicationStartDate).toLocaleDateString()} - {new Date(exam.applicationEndDate).toLocaleDateString()}</p>
                <p>Materials: {exam.materials?.length || 0}</p>
              </div>

              {expandedId === exam.id && (
                <div className="mt-4 space-y-4 border-t pt-4 ml-6">
                  <p className="text-sm text-gray-700">{exam.description}</p>

                  {/* Study Materials Section */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold text-sm">Study Materials</h5>
                      <button onClick={() => { setShowMaterialForm(exam.id); setEditingMaterialId(null); setMaterialData({}); }} className="text-xs px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200">+ Add Material</button>
                    </div>

                    {showMaterialForm === exam.id && (
                      <div className="bg-slate-50 p-3 rounded-lg mb-3 space-y-2 border">
                        <input type="text" placeholder="Title" value={materialData.title || ""} onChange={e => setMaterialData({ ...materialData, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" required />
                        <div className="grid grid-cols-2 gap-2">
                          <input type="text" placeholder="Subject" value={materialData.subject || ""} onChange={e => setMaterialData({ ...materialData, subject: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" required />
                          <select value={materialData.type || ""} onChange={e => setMaterialData({ ...materialData, type: e.target.value as any })} className="px-3 py-2 border rounded-lg text-sm" required>
                            <option value="">Material Type</option>
                            <option value="PDF">PDF</option>
                            <option value="Video">Video</option>
                            <option value="Notes">Notes</option>
                            <option value="Practice_Test">Practice Test</option>
                          </select>
                        </div>
                        <input type="url" placeholder="URL" value={materialData.url || ""} onChange={e => setMaterialData({ ...materialData, url: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" required />
                        <textarea placeholder="Description" value={materialData.description || ""} onChange={e => setMaterialData({ ...materialData, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" rows={2} required />
                        <div className="flex gap-2">
                          <button type="button" onClick={() => handleMaterialSubmit(exam.id)} className="flex-1 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">Save</button>
                          <button type="button" onClick={() => { setShowMaterialForm(null); setMaterialData({}); setEditingMaterialId(null); }} className="flex-1 px-3 py-1 bg-gray-400 text-white text-sm rounded hover:bg-gray-500">Cancel</button>
                        </div>
                      </div>
                    )}

                    {exam.materials?.map((material: any) => (
                      <div key={material.id} className="bg-slate-50 p-2 rounded-lg mb-2 flex justify-between items-start text-sm">
                        <div className="flex-1">
                          <p className="font-medium">{material.title}</p>
                          <p className="text-gray-600 text-xs">{material.subject} • {material.type}</p>
                          <p className="text-gray-500 text-xs mt-1">{material.description}</p>
                          <p className="text-blue-600 text-xs mt-1 truncate"><a href="about:blank" target="_blank" rel="noopener noreferrer">Material Link</a></p>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <button onClick={() => { setEditingMaterialId(material.id); setMaterialData(material); setShowMaterialForm(exam.id); }} className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                            <Edit className="w-3 h-3" />
                          </button>
                          <button onClick={() => deleteMaterialMut.mutate(material.id)} className="p-1 text-red-600 hover:bg-red-100 rounded">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
