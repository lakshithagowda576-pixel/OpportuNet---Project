import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCreateJob, useUpdateJob, useDeleteJob } from "@/hooks/useAdminMutations";
import { CreateJobInput, UpdateJobInput } from "@workspace/api-zod";
import { Plus, Edit, Trash2, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const apiFetch = (path: string) =>
  fetch(`${BASE}/api/admin${path}`, { credentials: "include" }).then(r => r.json());

export function JobManagement() {
  const { toast } = useToast();
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["admin-jobs"],
    queryFn: () => apiFetch("/jobs"),
  });

  const createJobMut = useCreateJob();
  const updateJobMut = useUpdateJob();
  const deleteJobMut = useDeleteJob();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<CreateJobInput>>({
    openings: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        updateJobMut.mutate({ id: editingId, data: formData as UpdateJobInput }, {
          onSuccess: () => {
            setFormData({ openings: 1 });
            setEditingId(null);
            setShowForm(false);
          },
        });
      } else {
        createJobMut.mutate(formData as CreateJobInput, {
          onSuccess: () => {
            setFormData({ openings: 1 });
            setShowForm(false);
          },
        });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleEdit = (job: any) => {
    setEditingId(job.id);
    setFormData(job);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this job?")) {
      deleteJobMut.mutate(id);
    }
  };

  const handleCancel = () => {
    setFormData({ openings: 1 });
    setEditingId(null);
    setShowForm(false);
  };

  if (isLoading) return <div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Manage Jobs</h3>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ openings: 1 }); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" /> Add Job
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-50 p-6 rounded-lg border border-slate-200 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Job Title" value={formData.title || ""} onChange={e => setFormData({ ...formData, title: e.target.value })} className="px-3 py-2 border rounded-lg" required />
            <input type="text" placeholder="Company" value={formData.company || ""} onChange={e => setFormData({ ...formData, company: e.target.value })} className="px-3 py-2 border rounded-lg" required />
            <select value={formData.category || ""} onChange={e => setFormData({ ...formData, category: e.target.value as any })} className="px-3 py-2 border rounded-lg" required>
              <option value="">Select Category</option>
              <option value="IT">IT</option>
              <option value="NON_IT">Non-IT</option>
              <option value="STATE_GOVT">State Govt</option>
              <option value="CENTRAL_GOVT">Central Govt</option>
            </select>
            <select value={formData.shift || ""} onChange={e => setFormData({ ...formData, shift: e.target.value as any })} className="px-3 py-2 border rounded-lg" required>
              <option value="">Select Shift</option>
              <option value="Day">Day</option>
              <option value="Night">Night</option>
              <option value="Full_time">Full Time</option>
              <option value="Part_time">Part Time</option>
            </select>
            <input type="text" placeholder="Location" value={formData.location || ""} onChange={e => setFormData({ ...formData, location: e.target.value })} className="px-3 py-2 border rounded-lg" required />
            <input type="email" placeholder="HR Email" value={formData.hrEmail || ""} onChange={e => setFormData({ ...formData, hrEmail: e.target.value })} className="px-3 py-2 border rounded-lg" required />
            <input type="text" placeholder="Salary" value={formData.salary || ""} onChange={e => setFormData({ ...formData, salary: e.target.value })} className="px-3 py-2 border rounded-lg" required />
            <input type="number" placeholder="Openings" value={formData.openings || 1} onChange={e => setFormData({ ...formData, openings: parseInt(e.target.value) })} className="px-3 py-2 border rounded-lg" required />
            <input type="date" value={formData.startDate || ""} onChange={e => setFormData({ ...formData, startDate: e.target.value })} className="px-3 py-2 border rounded-lg" required />
            <input type="date" value={formData.endDate || ""} onChange={e => setFormData({ ...formData, endDate: e.target.value })} className="px-3 py-2 border rounded-lg" required />
            <input type="url" placeholder="Application Link" value={formData.applicationLink || ""} onChange={e => setFormData({ ...formData, applicationLink: e.target.value })} className="px-3 py-2 border rounded-lg" />
            <input type="url" placeholder="Official URL" value={formData.official_url || ""} onChange={e => setFormData({ ...formData, official_url: e.target.value })} className="px-3 py-2 border rounded-lg" />
          </div>
          <textarea placeholder="Description" value={formData.description || ""} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={3} required />
          <textarea placeholder="Eligibility Criteria" value={formData.eligibility || ""} onChange={e => setFormData({ ...formData, eligibility: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={3} required />
          <textarea placeholder="Application Guide" value={formData.applicationGuide || ""} onChange={e => setFormData({ ...formData, applicationGuide: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={3} required />
          <div className="flex gap-2">
            <button type="submit" disabled={createJobMut.isPending || updateJobMut.isPending} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
              {createJobMut.isPending || updateJobMut.isPending ? "Saving..." : editingId ? "Update Job" : "Create Job"}
            </button>
            <button type="button" onClick={handleCancel} className="flex-1 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid gap-3">
        {jobs.map((job: any) => (
          <div key={job.id} className="bg-white p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-semibold text-blue-600">{job.title}</h4>
                <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(job)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(job.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm text-gray-600">
              <p>Category: {job.category}</p>
              <p>Shift: {job.shift}</p>
              <p>Openings: {job.openings}</p>
              <p>Salary: {job.salary}</p>
              <p>Start: {new Date(job.startDate).toLocaleDateString()}</p>
              <p>End: {new Date(job.endDate).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
