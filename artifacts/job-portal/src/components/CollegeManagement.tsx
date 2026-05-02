import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCreateCollege, useUpdateCollege, useDeleteCollege, useCreateCollegeCutoff, useUpdateCollegeCutoff, useDeleteCollegeCutoff, useCreateCollegeFee, useUpdateCollegeFee, useDeleteCollegeFee } from "@/hooks/useAdminMutations";
import { CreateCollegeInput, UpdateCollegeInput, CreateCollegeCutoffInput, UpdateCollegeCutoffInput, CreateCollegeFeeInput, UpdateCollegeFeeInput } from "@workspace/api-zod";
import { Plus, Edit, Trash2, ChevronDown, ChevronUp, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const apiFetch = (path: string) =>
  fetch(`${BASE}/api/admin${path}`, { credentials: "include" }).then(r => r.json());

export function CollegeManagement() {
  const { toast } = useToast();
  const { data: colleges = [], isLoading } = useQuery({
    queryKey: ["admin-colleges"],
    queryFn: () => apiFetch("/colleges"),
  });

  const createCollegeMut = useCreateCollege();
  const updateCollegeMut = useUpdateCollege();
  const deleteCollegeMut = useDeleteCollege();
  const createCutoffMut = useCreateCollegeCutoff();
  const updateCutoffMut = useUpdateCollegeCutoff();
  const deleteCutoffMut = useDeleteCollegeCutoff();
  const createFeeMut = useCreateCollegeFee();
  const updateFeeMut = useUpdateCollegeFee();
  const deleteFeeMut = useDeleteCollegeFee();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<CreateCollegeInput>>({});
  const [showCutoffForm, setShowCutoffForm] = useState<number | null>(null);
  const [showFeeForm, setShowFeeForm] = useState<number | null>(null);
  const [cutoffData, setCutoffData] = useState<Partial<CreateCollegeCutoffInput>>({});
  const [feeData, setFeeData] = useState<Partial<CreateCollegeFeeInput>>({});
  const [editingCutoffId, setEditingCutoffId] = useState<number | null>(null);
  const [editingFeeId, setEditingFeeId] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        updateCollegeMut.mutate({ id: editingId, data: formData as UpdateCollegeInput }, {
          onSuccess: () => {
            setFormData({});
            setEditingId(null);
            setShowForm(false);
          },
        });
      } else {
        createCollegeMut.mutate(formData as CreateCollegeInput, {
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

  const handleCutoffSubmit = (collegeId: number) => {
    if (editingCutoffId) {
      updateCutoffMut.mutate({ id: editingCutoffId, data: cutoffData as UpdateCollegeCutoffInput }, {
        onSuccess: () => {
          setCutoffData({});
          setEditingCutoffId(null);
          setShowCutoffForm(null);
        },
      });
    } else {
      createCutoffMut.mutate({ collegeId, ...cutoffData } as CreateCollegeCutoffInput, {
        onSuccess: () => {
          setCutoffData({});
          setShowCutoffForm(null);
        },
      });
    }
  };

  const handleFeeSubmit = (collegeId: number) => {
    if (editingFeeId) {
      updateFeeMut.mutate({ id: editingFeeId, data: feeData as UpdateCollegeFeeInput }, {
        onSuccess: () => {
          setFeeData({});
          setEditingFeeId(null);
          setShowFeeForm(null);
        },
      });
    } else {
      createFeeMut.mutate({ collegeId, ...feeData } as CreateCollegeFeeInput, {
        onSuccess: () => {
          setFeeData({});
          setShowFeeForm(null);
        },
      });
    }
  };

  const handleEdit = (college: any) => {
    setEditingId(college.id);
    setFormData(college);
    setShowForm(true);
  };

  const handleDeleteCollege = (id: number) => {
    if (confirm("Delete this college and all its data?")) {
      deleteCollegeMut.mutate(id);
    }
  };

  if (isLoading) return <div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Manage Colleges</h3>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({}); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" /> Add College
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-50 p-6 rounded-lg border border-slate-200 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="College Name" value={formData.name || ""} onChange={e => setFormData({ ...formData, name: e.target.value })} className="px-3 py-2 border rounded-lg" required />
            <input type="text" placeholder="Location" value={formData.location || ""} onChange={e => setFormData({ ...formData, location: e.target.value })} className="px-3 py-2 border rounded-lg" required />
            <input type="text" placeholder="City" value={formData.city || ""} onChange={e => setFormData({ ...formData, city: e.target.value })} className="px-3 py-2 border rounded-lg" required />
            <input type="text" placeholder="State" value={formData.state || ""} onChange={e => setFormData({ ...formData, state: e.target.value })} className="px-3 py-2 border rounded-lg" required />
            <input type="text" placeholder="College Code" value={formData.collegeCode || ""} onChange={e => setFormData({ ...formData, collegeCode: e.target.value })} className="px-3 py-2 border rounded-lg" />
            <input type="text" placeholder="Affiliation" value={formData.affiliation || ""} onChange={e => setFormData({ ...formData, affiliation: e.target.value })} className="px-3 py-2 border rounded-lg" />
            <input type="url" placeholder="Website URL" value={formData.websiteUrl || ""} onChange={e => setFormData({ ...formData, websiteUrl: e.target.value })} className="px-3 py-2 border rounded-lg" />
            <input type="email" placeholder="Contact Email" value={formData.contactEmail || ""} onChange={e => setFormData({ ...formData, contactEmail: e.target.value })} className="px-3 py-2 border rounded-lg" />
            <input type="tel" placeholder="Contact Phone" value={formData.contactPhone || ""} onChange={e => setFormData({ ...formData, contactPhone: e.target.value })} className="px-3 py-2 border rounded-lg" />
            <input type="number" placeholder="Established Year" value={formData.establishedYear || ""} onChange={e => setFormData({ ...formData, establishedYear: parseInt(e.target.value) })} className="px-3 py-2 border rounded-lg" />
          </div>
          <textarea placeholder="About" value={formData.about || ""} onChange={e => setFormData({ ...formData, about: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={3} />
          <textarea placeholder="Qualification" value={formData.qualification || ""} onChange={e => setFormData({ ...formData, qualification: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={2} />
          <div className="flex gap-2">
            <button type="submit" disabled={createCollegeMut.isPending || updateCollegeMut.isPending} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
              {createCollegeMut.isPending || updateCollegeMut.isPending ? "Saving..." : editingId ? "Update College" : "Create College"}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setFormData({}); setEditingId(null); }} className="flex-1 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid gap-3">
        {colleges.map((college: any) => (
          <div key={college.id} className="bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition">
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 cursor-pointer" onClick={() => setExpandedId(expandedId === college.id ? null : college.id)}>
                  <div className="flex items-center gap-2">
                    {expandedId === college.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    <h4 className="font-semibold text-blue-600">{college.name}</h4>
                  </div>
                  <p className="text-sm text-gray-600 ml-6">{college.city}, {college.state}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(college)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteCollege(college.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {expandedId === college.id && (
                <div className="mt-4 space-y-4 border-t pt-4">
                  {/* Cutoffs Section */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold text-sm">Cutoffs</h5>
                      <button onClick={() => { setShowCutoffForm(college.id); setEditingCutoffId(null); setCutoffData({}); }} className="text-xs px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200">+ Add Cutoff</button>
                    </div>
                    {showCutoffForm === college.id && (
                      <div className="bg-slate-50 p-3 rounded-lg mb-3 space-y-2 border">
                        <input type="text" placeholder="Course Name" value={cutoffData.courseName || ""} onChange={e => setCutoffData({ ...cutoffData, courseName: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" required />
                        <div className="grid grid-cols-2 gap-2">
                          <input type="text" placeholder="Category" value={cutoffData.category || ""} onChange={e => setCutoffData({ ...cutoffData, category: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" />
                          <input type="number" placeholder="Cutoff Score" value={cutoffData.cutoffScore || ""} onChange={e => setCutoffData({ ...cutoffData, cutoffScore: parseInt(e.target.value) })} className="px-3 py-2 border rounded-lg text-sm" required />
                          <input type="number" placeholder="UG Seats" value={cutoffData.ugSeats || ""} onChange={e => setCutoffData({ ...cutoffData, ugSeats: parseInt(e.target.value) })} className="px-3 py-2 border rounded-lg text-sm" />
                          <input type="number" placeholder="PG Seats" value={cutoffData.pgSeats || ""} onChange={e => setCutoffData({ ...cutoffData, pgSeats: parseInt(e.target.value) })} className="px-3 py-2 border rounded-lg text-sm" />
                          <input type="text" placeholder="Academic Year" value={cutoffData.academicYear || ""} onChange={e => setCutoffData({ ...cutoffData, academicYear: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" />
                        </div>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => handleCutoffSubmit(college.id)} className="flex-1 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">Save</button>
                          <button type="button" onClick={() => { setShowCutoffForm(null); setCutoffData({}); setEditingCutoffId(null); }} className="flex-1 px-3 py-1 bg-gray-400 text-white text-sm rounded hover:bg-gray-500">Cancel</button>
                        </div>
                      </div>
                    )}
                    {college.cutoffs?.map((cutoff: any) => (
                      <div key={cutoff.id} className="bg-slate-50 p-2 rounded-lg mb-2 flex justify-between items-center text-sm">
                        <div>
                          <p className="font-medium">{cutoff.courseName}</p>
                          <p className="text-gray-600 text-xs">Score: {cutoff.cutoffScore} | Seats: UG {cutoff.ugSeats} / PG {cutoff.pgSeats}</p>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => { setEditingCutoffId(cutoff.id); setCutoffData(cutoff); setShowCutoffForm(college.id); }} className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                            <Edit className="w-3 h-3" />
                          </button>
                          <button onClick={() => deleteCutoffMut.mutate(cutoff.id)} className="p-1 text-red-600 hover:bg-red-100 rounded">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Fees Section */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold text-sm">Fees</h5>
                      <button onClick={() => { setShowFeeForm(college.id); setEditingFeeId(null); setFeeData({}); }} className="text-xs px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200">+ Add Fee</button>
                    </div>
                    {showFeeForm === college.id && (
                      <div className="bg-slate-50 p-3 rounded-lg mb-3 space-y-2 border">
                        <div className="grid grid-cols-2 gap-2">
                          <select value={feeData.courseType || ""} onChange={e => setFeeData({ ...feeData, courseType: e.target.value as "UG" | "PG" })} className="px-3 py-2 border rounded-lg text-sm" required>
                            <option value="">Course Type</option>
                            <option value="UG">UG</option>
                            <option value="PG">PG</option>
                          </select>
                          <input type="text" placeholder="Course Name" value={feeData.courseName || ""} onChange={e => setFeeData({ ...feeData, courseName: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" required />
                          <input type="text" placeholder="Annual Fees" value={feeData.annualFees || ""} onChange={e => setFeeData({ ...feeData, annualFees: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" />
                          <input type="text" placeholder="Total Fees" value={feeData.totalFees || ""} onChange={e => setFeeData({ ...feeData, totalFees: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" />
                        </div>
                        <textarea placeholder="Description" value={feeData.description || ""} onChange={e => setFeeData({ ...feeData, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" rows={2} />
                        <div className="flex gap-2">
                          <button type="button" onClick={() => handleFeeSubmit(college.id)} className="flex-1 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">Save</button>
                          <button type="button" onClick={() => { setShowFeeForm(null); setFeeData({}); setEditingFeeId(null); }} className="flex-1 px-3 py-1 bg-gray-400 text-white text-sm rounded hover:bg-gray-500">Cancel</button>
                        </div>
                      </div>
                    )}
                    {college.fees?.map((fee: any) => (
                      <div key={fee.id} className="bg-slate-50 p-2 rounded-lg mb-2 flex justify-between items-center text-sm">
                        <div>
                          <p className="font-medium">{fee.courseType} - {fee.courseName}</p>
                          <p className="text-gray-600 text-xs">Annual: {fee.annualFees} | Total: {fee.totalFees}</p>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => { setEditingFeeId(fee.id); setFeeData(fee); setShowFeeForm(college.id); }} className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                            <Edit className="w-3 h-3" />
                          </button>
                          <button onClick={() => deleteFeeMut.mutate(fee.id)} className="p-1 text-red-600 hover:bg-red-100 rounded">
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
