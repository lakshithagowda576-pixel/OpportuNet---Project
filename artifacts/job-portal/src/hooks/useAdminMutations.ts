import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  CreateJobInput, UpdateJobInput,
  CreateCollegeInput, UpdateCollegeInput,
  CreateCollegeCutoffInput, UpdateCollegeCutoffInput,
  CreateCollegeFeeInput, UpdateCollegeFeeInput,
  CreateExamInput, UpdateExamInput,
  CreateStudyMaterialInput, UpdateStudyMaterialInput,
} from "@workspace/api-zod";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const apiFetch = (path: string, opts?: RequestInit) =>
  fetch(`${BASE}/api/admin${path}`, { credentials: "include", ...opts }).then(r => {
    if (!r.ok) throw new Error(r.statusText);
    return r.json();
  });

// ============================================================================
// JOBS HOOKS
// ============================================================================

export function useCreateJob() {
  const { toast } = useToast();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateJobInput) =>
      apiFetch("/jobs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast({ title: "Success", description: "Job created successfully" });
      qc.invalidateQueries({ queryKey: ["admin-jobs"] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to create job", variant: "destructive" });
    },
  });
}

export function useUpdateJob() {
  const { toast } = useToast();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateJobInput }) =>
      apiFetch(`/jobs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast({ title: "Success", description: "Job updated successfully" });
      qc.invalidateQueries({ queryKey: ["admin-jobs"] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to update job", variant: "destructive" });
    },
  });
}

export function useDeleteJob() {
  const { toast } = useToast();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      apiFetch(`/jobs/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast({ title: "Success", description: "Job deleted successfully" });
      qc.invalidateQueries({ queryKey: ["admin-jobs"] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to delete job", variant: "destructive" });
    },
  });
}

// ============================================================================
// COLLEGES HOOKS
// ============================================================================

export function useCreateCollege() {
  const { toast } = useToast();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCollegeInput) =>
      apiFetch("/colleges/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast({ title: "Success", description: "College created successfully" });
      qc.invalidateQueries({ queryKey: ["admin-colleges"] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to create college", variant: "destructive" });
    },
  });
}

export function useUpdateCollege() {
  const { toast } = useToast();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCollegeInput }) =>
      apiFetch(`/colleges/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast({ title: "Success", description: "College updated successfully" });
      qc.invalidateQueries({ queryKey: ["admin-colleges"] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to update college", variant: "destructive" });
    },
  });
}

export function useDeleteCollege() {
  const { toast } = useToast();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      apiFetch(`/colleges/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast({ title: "Success", description: "College deleted successfully" });
      qc.invalidateQueries({ queryKey: ["admin-colleges"] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to delete college", variant: "destructive" });
    },
  });
}

// ============================================================================
// COLLEGE CUTOFFS HOOKS
// ============================================================================

export function useCreateCollegeCutoff() {
  const { toast } = useToast();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCollegeCutoffInput) =>
      apiFetch("/college-cutoffs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast({ title: "Success", description: "Cutoff created successfully" });
      qc.invalidateQueries({ queryKey: ["admin-colleges"] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to create cutoff", variant: "destructive" });
    },
  });
}

export function useUpdateCollegeCutoff() {
  const { toast } = useToast();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCollegeCutoffInput }) =>
      apiFetch(`/college-cutoffs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast({ title: "Success", description: "Cutoff updated successfully" });
      qc.invalidateQueries({ queryKey: ["admin-colleges"] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to update cutoff", variant: "destructive" });
    },
  });
}

export function useDeleteCollegeCutoff() {
  const { toast } = useToast();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      apiFetch(`/college-cutoffs/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast({ title: "Success", description: "Cutoff deleted successfully" });
      qc.invalidateQueries({ queryKey: ["admin-colleges"] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to delete cutoff", variant: "destructive" });
    },
  });
}

// ============================================================================
// COLLEGE FEES HOOKS
// ============================================================================

export function useCreateCollegeFee() {
  const { toast } = useToast();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCollegeFeeInput) =>
      apiFetch("/college-fees/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast({ title: "Success", description: "Fee created successfully" });
      qc.invalidateQueries({ queryKey: ["admin-colleges"] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to create fee", variant: "destructive" });
    },
  });
}

export function useUpdateCollegeFee() {
  const { toast } = useToast();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCollegeFeeInput }) =>
      apiFetch(`/college-fees/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast({ title: "Success", description: "Fee updated successfully" });
      qc.invalidateQueries({ queryKey: ["admin-colleges"] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to update fee", variant: "destructive" });
    },
  });
}

export function useDeleteCollegeFee() {
  const { toast } = useToast();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      apiFetch(`/college-fees/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast({ title: "Success", description: "Fee deleted successfully" });
      qc.invalidateQueries({ queryKey: ["admin-colleges"] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to delete fee", variant: "destructive" });
    },
  });
}

// ============================================================================
// EXAMS HOOKS
// ============================================================================

export function useCreateExam() {
  const { toast } = useToast();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExamInput) =>
      apiFetch("/exams/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast({ title: "Success", description: "Exam created successfully" });
      qc.invalidateQueries({ queryKey: ["admin-exams"] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to create exam", variant: "destructive" });
    },
  });
}

export function useUpdateExam() {
  const { toast } = useToast();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateExamInput }) =>
      apiFetch(`/exams/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast({ title: "Success", description: "Exam updated successfully" });
      qc.invalidateQueries({ queryKey: ["admin-exams"] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to update exam", variant: "destructive" });
    },
  });
}

export function useDeleteExam() {
  const { toast } = useToast();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      apiFetch(`/exams/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast({ title: "Success", description: "Exam deleted successfully" });
      qc.invalidateQueries({ queryKey: ["admin-exams"] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to delete exam", variant: "destructive" });
    },
  });
}

// ============================================================================
// STUDY MATERIALS HOOKS
// ============================================================================

export function useCreateStudyMaterial() {
  const { toast } = useToast();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStudyMaterialInput) =>
      apiFetch("/study-materials/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast({ title: "Success", description: "Study material created successfully" });
      qc.invalidateQueries({ queryKey: ["admin-exams"] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to create study material", variant: "destructive" });
    },
  });
}

export function useUpdateStudyMaterial() {
  const { toast } = useToast();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateStudyMaterialInput }) =>
      apiFetch(`/study-materials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast({ title: "Success", description: "Study material updated successfully" });
      qc.invalidateQueries({ queryKey: ["admin-exams"] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to update study material", variant: "destructive" });
    },
  });
}

export function useDeleteStudyMaterial() {
  const { toast } = useToast();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      apiFetch(`/study-materials/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast({ title: "Success", description: "Study material deleted successfully" });
      qc.invalidateQueries({ queryKey: ["admin-exams"] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to delete study material", variant: "destructive" });
    },
  });
}
