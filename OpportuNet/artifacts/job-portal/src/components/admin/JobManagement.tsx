import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCreateJob, useUpdateJob, useDeleteJob } from "@/hooks/use-admin-mutations";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const apiFetch = (path: string, opts?: RequestInit) =>
  fetch(`${BASE}/api/admin${path}`, { credentials: "include", ...opts }).then(r => r.json());

interface Job {
  id: number;
  title: string;
  company: string;
  category: string;
  location: string;
  shift: string;
  description: string;
  eligibility: string;
  applicationGuide: string;
  startDate: string;
  endDate: string;
  hrEmail: string;
  salary: string;
  openings: number;
  applicationLink: string;
  createdAt: string;
}

export function JobManagement() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    category: "IT",
    location: "",
    shift: "Full_time",
    description: "",
    eligibility: "",
    applicationGuide: "",
    startDate: "",
    endDate: "",
    hrEmail: "",
    salary: "",
    openings: 1,
    applicationLink: "",
  });

  const { data: jobs = [] } = useQuery({
    queryKey: ["admin-jobs"],
    queryFn: () => apiFetch("/jobs"),
  });

  const createMutation = useCreateJob();
  const updateMutation = useUpdateJob();
  const deleteMutation = useDeleteJob();

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
      title: "",
      company: "",
      category: "IT",
      location: "",
      shift: "Full_time",
      description: "",
      eligibility: "",
      applicationGuide: "",
      startDate: "",
      endDate: "",
      hrEmail: "",
      salary: "",
      openings: 1,
      applicationLink: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (job: Job) => {
    setFormData({
      title: job.title,
      company: job.company,
      category: job.category,
      location: job.location,
      shift: job.shift,
      description: job.description,
      eligibility: job.eligibility,
      applicationGuide: job.applicationGuide,
      startDate: job.startDate,
      endDate: job.endDate,
      hrEmail: job.hrEmail,
      salary: job.salary,
      openings: job.openings,
      applicationLink: job.applicationLink,
    });
    setEditingId(job.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Jobs Management</h2>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" /> Add Job
        </Button>
      </div>

      {showForm && (
        <div className="bg-card p-6 rounded-lg border border-border shadow-sm space-y-4">
          <h3 className="text-lg font-semibold">{editingId ? "Edit Job" : "Create New Job"}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Job Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="px-3 py-2 border border-border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="px-3 py-2 border border-border rounded-lg"
                required
              />
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="px-3 py-2 border border-border rounded-lg"
              >
                <option value="IT">IT</option>
                <option value="NON_IT">Non-IT</option>
                <option value="STATE_GOVT">State Government</option>
                <option value="CENTRAL_GOVT">Central Government</option>
              </select>
              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="px-3 py-2 border border-border rounded-lg"
                required
              />
              <select
                value={formData.shift}
                onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                className="px-3 py-2 border border-border rounded-lg"
              >
                <option value="Full_time">Full-time</option>
                <option value="Part_time">Part-time</option>
                <option value="Day">Day</option>
                <option value="Night">Night</option>
              </select>
              <input
                type="text"
                placeholder="Salary Range"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                className="px-3 py-2 border border-border rounded-lg"
              />
              <input
                type="number"
                placeholder="Number of Openings"
                value={formData.openings}
                onChange={(e) => setFormData({ ...formData, openings: parseInt(e.target.value) })}
                className="px-3 py-2 border border-border rounded-lg"
                min="1"
              />
              <input
                type="email"
                placeholder="HR Email"
                value={formData.hrEmail}
                onChange={(e) => setFormData({ ...formData, hrEmail: e.target.value })}
                className="px-3 py-2 border border-border rounded-lg"
                required
              />
              <input
                type="datetime-local"
                placeholder="Start Date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="px-3 py-2 border border-border rounded-lg"
                required
              />
              <input
                type="datetime-local"
                placeholder="End Date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="px-3 py-2 border border-border rounded-lg"
                required
              />
              <input
                type="url"
                placeholder="Application Link (optional)"
                value={formData.applicationLink}
                onChange={(e) => setFormData({ ...formData, applicationLink: e.target.value })}
                className="px-3 py-2 border border-border rounded-lg"
              />
            </div>
            <textarea
              placeholder="Job Description"
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
              rows={3}
              required
            />
            <textarea
              placeholder="Application Guide"
              value={formData.applicationGuide}
              onChange={(e) => setFormData({ ...formData, applicationGuide: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg"
              rows={3}
              required
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingId ? "Update" : "Create"} Job
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
              <th className="px-6 py-3 text-left text-sm font-semibold">Company</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Location</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Openings</th>
              <th className="px-6 py-3 text-right text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {jobs.map((job: Job) => (
              <tr key={job.id} className="hover:bg-secondary/50 transition-colors">
                <td className="px-6 py-4 text-sm">{job.title}</td>
                <td className="px-6 py-4 text-sm">{job.company}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                    {job.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">{job.location}</td>
                <td className="px-6 py-4 text-sm">{job.openings}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(job)}
                      className="p-1 hover:bg-blue-100 rounded text-blue-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(job.id)}
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
        {jobs.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            No jobs found
          </div>
        )}
      </div>
    </div>
  );
}
