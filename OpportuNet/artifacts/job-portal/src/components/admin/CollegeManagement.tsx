import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCreateCollege, useUpdateCollege, useDeleteCollege } from "@/hooks/use-admin-mutations";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, AlertCircle } from "lucide-react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const apiFetch = (path: string, opts?: RequestInit) =>
  fetch(`${BASE}/api/admin${path}`, { credentials: "include", ...opts }).then(r => r.json());

interface College {
  id: number;
  name: string;
  location: string;
  city: string;
  state: string;
  collegeCode?: string;
  affiliation?: string;
  about?: string;
  websiteUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  establishedYear?: number;
  facilities?: string[];
  qualification?: string;
  createdAt: string;
  updatedAt: string;
}

export function CollegeManagement() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    city: "",
    state: "",
    collegeCode: "",
    affiliation: "",
    about: "",
    websiteUrl: "",
    contactEmail: "",
    contactPhone: "",
    establishedYear: new Date().getFullYear(),
    facilities: [] as string[],
    qualification: "",
  });

  const { data: colleges = [] } = useQuery({
    queryKey: ["admin-colleges"],
    queryFn: () => apiFetch("/colleges"),
  });

  const createMutation = useCreateCollege();
  const updateMutation = useUpdateCollege();
  const deleteMutation = useDeleteCollege();

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
      location: "",
      city: "",
      state: "",
      collegeCode: "",
      affiliation: "",
      about: "",
      websiteUrl: "",
      contactEmail: "",
      contactPhone: "",
      establishedYear: new Date().getFullYear(),
      facilities: [],
      qualification: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (college: College) => {
    setFormData({
      name: college.name,
      location: college.location,
      city: college.city,
      state: college.state,
      collegeCode: college.collegeCode || "",
      affiliation: college.affiliation || "",
      about: college.about || "",
      websiteUrl: college.websiteUrl || "",
      contactEmail: college.contactEmail || "",
      contactPhone: college.contactPhone || "",
      establishedYear: college.establishedYear || new Date().getFullYear(),
      facilities: college.facilities || [],
      qualification: college.qualification || "",
    });
    setEditingId(college.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Colleges Management</h2>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" /> Add College
        </Button>
      </div>

      {showForm && (
        <div className="bg-card p-6 rounded-lg border border-border shadow-sm space-y-4">
          <h3 className="text-lg font-semibold">{editingId ? "Edit College" : "Create New College"}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="College Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-3 py-2 border border-border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="px-3 py-2 border border-border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="px-3 py-2 border border-border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="State"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="px-3 py-2 border border-border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="College Code (optional)"
                value={formData.collegeCode}
                onChange={(e) => setFormData({ ...formData, collegeCode: e.target.value })}
                className="px-3 py-2 border border-border rounded-lg"
              />
              <input
                type="text"
                placeholder="Affiliation (optional)"
                value={formData.affiliation}
                onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
                className="px-3 py-2 border border-border rounded-lg"
              />
              <input
                type="url"
                placeholder="Website URL (optional)"
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                className="px-3 py-2 border border-border rounded-lg"
              />
              <input
                type="email"
                placeholder="Contact Email (optional)"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="px-3 py-2 border border-border rounded-lg"
              />
              <input
                type="tel"
                placeholder="Contact Phone (optional)"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="px-3 py-2 border border-border rounded-lg"
              />
              <input
                type="number"
                placeholder="Established Year (optional)"
                value={formData.establishedYear}
                onChange={(e) => setFormData({ ...formData, establishedYear: parseInt(e.target.value) })}
                className="px-3 py-2 border border-border rounded-lg"
              />
            </div>
            <textarea
              placeholder="About the College (optional)"
              value={formData.about}
              onChange={(e) => setFormData({ ...formData, about: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg"
              rows={3}
            />
            <textarea
              placeholder="Qualification Criteria (optional)"
              value={formData.qualification}
              onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg"
              rows={2}
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingId ? "Update" : "Create"} College
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
              <th className="px-6 py-3 text-left text-sm font-semibold">City</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">State</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Contact</th>
              <th className="px-6 py-3 text-right text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {colleges.map((college: College) => (
              <tr key={college.id} className="hover:bg-secondary/50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium">{college.name}</td>
                <td className="px-6 py-4 text-sm">{college.city}</td>
                <td className="px-6 py-4 text-sm">{college.state}</td>
                <td className="px-6 py-4 text-sm">{college.contactEmail || college.contactPhone || "—"}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(college)}
                      className="p-1 hover:bg-blue-100 rounded text-blue-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(college.id)}
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
        {colleges.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            No colleges found
          </div>
        )}
      </div>
    </div>
  );
}
