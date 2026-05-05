import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";
import axios from "axios";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const apiFetch = (path: string, opts?: RequestInit) =>
  fetch(`${BASE}/api/admin${path}`, { credentials: "include", ...opts }).then(r => r.json());

// ==================== JOBS ====================

export function useCreateJob() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: any) =>
      apiFetch("/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
      toast({ title: "Job Created", description: "Job has been successfully created." });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create job",
        description: error?.message || "An error occurred",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateJob() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      apiFetch(`/jobs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
      toast({ title: "Job Updated", description: "Job has been successfully updated." });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update job",
        description: error?.message || "An error occurred",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) =>
      apiFetch(`/jobs/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
      toast({ title: "Job Deleted", description: "Job has been successfully deleted." });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete job",
        description: error?.message || "An error occurred",
        variant: "destructive",
      });
    },
  });
}

// ==================== COLLEGES ====================

export function useCreateCollege() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: any) =>
      apiFetch("/colleges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-colleges"] });
      toast({ title: "College Created", description: "College has been successfully created." });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create college",
        description: error?.message || "An error occurred",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateCollege() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      apiFetch(`/colleges/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-colleges"] });
      toast({ title: "College Updated", description: "College has been successfully updated." });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update college",
        description: error?.message || "An error occurred",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteCollege() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) =>
      apiFetch(`/colleges/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-colleges"] });
      toast({ title: "College Deleted", description: "College has been successfully deleted." });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete college",
        description: error?.message || "An error occurred",
        variant: "destructive",
      });
    },
  });
}

// ==================== COLLEGE CUTOFFS ====================

export function useCreateCollegeCutoff() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: any) =>
      apiFetch("/college-cutoffs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-college-cutoffs"] });
      toast({ title: "Cutoff Created", description: "College cutoff has been successfully created." });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create cutoff",
        description: error?.message || "An error occurred",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateCollegeCutoff() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      apiFetch(`/college-cutoffs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-college-cutoffs"] });
      toast({ title: "Cutoff Updated", description: "College cutoff has been successfully updated." });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update cutoff",
        description: error?.message || "An error occurred",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteCollegeCutoff() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) =>
      apiFetch(`/college-cutoffs/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-college-cutoffs"] });
      toast({ title: "Cutoff Deleted", description: "College cutoff has been successfully deleted." });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete cutoff",
        description: error?.message || "An error occurred",
        variant: "destructive",
      });
    },
  });
}

// ==================== COLLEGE FEES ====================

export function useCreateCollegeFee() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: any) =>
      apiFetch("/college-fees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-college-fees"] });
      toast({ title: "Fee Created", description: "College fee has been successfully created." });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create fee",
        description: error?.message || "An error occurred",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateCollegeFee() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      apiFetch(`/college-fees/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-college-fees"] });
      toast({ title: "Fee Updated", description: "College fee has been successfully updated." });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update fee",
        description: error?.message || "An error occurred",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteCollegeFee() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) =>
      apiFetch(`/college-fees/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-college-fees"] });
      toast({ title: "Fee Deleted", description: "College fee has been successfully deleted." });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete fee",
        description: error?.message || "An error occurred",
        variant: "destructive",
      });
    },
  });
}

// ==================== EXAMS ====================

export function useCreateExam() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: any) =>
      apiFetch("/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-exams"] });
      toast({ title: "Exam Created", description: "Exam has been successfully created." });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create exam",
        description: error?.message || "An error occurred",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateExam() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      apiFetch(`/exams/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-exams"] });
      toast({ title: "Exam Updated", description: "Exam has been successfully updated." });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update exam",
        description: error?.message || "An error occurred",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteExam() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) =>
      apiFetch(`/exams/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-exams"] });
      toast({ title: "Exam Deleted", description: "Exam has been successfully deleted." });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete exam",
        description: error?.message || "An error occurred",
        variant: "destructive",
      });
    },
  });
}

// ==================== STUDY MATERIALS ====================

export function useCreateStudyMaterial() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: any) =>
      apiFetch("/study-materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-study-materials"] });
      toast({ title: "Material Created", description: "Study material has been successfully created." });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create material",
        description: error?.message || "An error occurred",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateStudyMaterial() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      apiFetch(`/study-materials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-study-materials"] });
      toast({ title: "Material Updated", description: "Study material has been successfully updated." });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update material",
        description: error?.message || "An error occurred",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteStudyMaterial() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) =>
      apiFetch(`/study-materials/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-study-materials"] });
      toast({ title: "Material Deleted", description: "Study material has been successfully deleted." });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete material",
        description: error?.message || "An error occurred",
        variant: "destructive",
      });
    },
  });
}
