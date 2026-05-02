# OpportuNet CRUD - Code Examples & Quick Reference

## Quick Copy-Paste Examples

### Creating Jobs Programmatically

#### Using the Hook (Recommended)
```typescript
import { useCreateJob } from '@/hooks/useAdminMutations';
import { CreateJobInput } from '@workspace/api-zod';

function MyJobForm() {
  const createJobMut = useCreateJob();

  const handleCreate = (data: CreateJobInput) => {
    createJobMut.mutate(data, {
      onSuccess: (newJob) => {
        console.log('Job created:', newJob);
      },
    });
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleCreate({
        title: 'Senior Developer',
        company: 'Acme Corp',
        category: 'IT',
        location: 'San Francisco',
        shift: 'Day',
        description: 'We are looking for...',
        eligibility: 'B.Tech required...',
        applicationGuide: 'Apply online...',
        startDate: '2024-06-01',
        endDate: '2024-07-01',
        hrEmail: 'hr@acme.com',
        salary: '20-25 LPA',
        openings: 3,
      });
    }}>
      {/* Form fields */}
    </form>
  );
}
```

#### Using Fetch API Directly
```typescript
const createJob = async (jobData: CreateJobInput) => {
  const response = await fetch('/api/admin/jobs/create', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jobData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return response.json();
};
```

---

### Creating Colleges with Cutoffs

```typescript
import { useCreateCollege, useCreateCollegeCutoff } from '@/hooks/useAdminMutations';
import { CreateCollegeInput, CreateCollegeCutoffInput } from '@workspace/api-zod';

function AddCollegeWithCutoff() {
  const createCollegeMut = useCreateCollege();
  const createCutoffMut = useCreateCollegeCutoff();

  const handleAddCollege = async (collegeData: CreateCollegeInput) => {
    createCollegeMut.mutate(collegeData, {
      onSuccess: (newCollege) => {
        // Now add a cutoff
        const cutoffData: CreateCollegeCutoffInput = {
          collegeId: newCollege.id,
          courseName: 'B.Tech Computer Science',
          category: 'General',
          cutoffScore: 85,
          ugSeats: 120,
          pgSeats: 30,
          academicYear: '2024-25',
        };
        
        createCutoffMut.mutate(cutoffData);
      },
    });
  };

  return (
    <div>
      {/* Add College Form */}
    </div>
  );
}
```

---

### Creating Exams with Study Materials

```typescript
import { useCreateExam, useCreateStudyMaterial } from '@/hooks/useAdminMutations';
import { CreateExamInput, CreateStudyMaterialInput } from '@workspace/api-zod';

function AddExamWithMaterials() {
  const createExamMut = useCreateExam();
  const createMaterialMut = useCreateStudyMaterial();

  const handleAddExam = async (examData: CreateExamInput) => {
    createExamMut.mutate(examData, {
      onSuccess: (newExam) => {
        // Add first study material
        const materialData: CreateStudyMaterialInput = {
          examId: newExam.id,
          title: 'Physics Notes - Chapter 1-5',
          subject: 'Physics',
          type: 'Notes',
          description: 'Comprehensive notes covering mechanics and waves',
          url: 'https://example.com/physics-notes.pdf',
        };
        
        createMaterialMut.mutate(materialData);
      },
    });
  };

  return (
    <div>
      {/* Add Exam Form */}
    </div>
  );
}
```

---

### Updating Records

```typescript
import { useUpdateJob, useUpdateCollege, useUpdateExam } from '@/hooks/useAdminMutations';
import { UpdateJobInput, UpdateCollegeInput, UpdateExamInput } from '@workspace/api-zod';

// Update Job
const updateJobMut = useUpdateJob();
updateJobMut.mutate({
  id: 1,
  data: {
    title: 'Updated Job Title',
    salary: '25-30 LPA', // Only update specific fields
  },
});

// Update College
const updateCollegeMut = useUpdateCollege();
updateCollegeMut.mutate({
  id: 1,
  data: {
    about: 'Updated about section',
    contactEmail: 'newhr@college.com',
  },
});

// Update Exam
const updateExamMut = useUpdateExam();
updateExamMut.mutate({
  id: 1,
  data: {
    description: 'Updated exam description',
  },
});
```

---

### Deleting Records

```typescript
import { useDeleteJob, useDeleteCollege, useDeleteExam, useDeleteStudyMaterial } from '@/hooks/useAdminMutations';

// Delete Job
const deleteJobMut = useDeleteJob();
if (confirm('Delete this job?')) {
  deleteJobMut.mutate(1);
}

// Delete College (cascades to cutoffs and fees)
const deleteCollegeMut = useDeleteCollege();
if (confirm('Delete college and all data?')) {
  deleteCollegeMut.mutate(1);
}

// Delete Exam (cascades to materials)
const deleteExamMut = useDeleteExam();
if (confirm('Delete exam and all materials?')) {
  deleteExamMut.mutate(1);
}

// Delete Study Material
const deleteMaterialMut = useDeleteStudyMaterial();
deleteMaterialMut.mutate(materialId);
```

---

### Batch Operations Example

```typescript
import { useCreateJob } from '@/hooks/useAdminMutations';
import { CreateJobInput } from '@workspace/api-zod';

async function createMultipleJobs(jobsData: CreateJobInput[]) {
  const createJobMut = useCreateJob();
  
  for (const jobData of jobsData) {
    await new Promise((resolve) => {
      createJobMut.mutate(jobData, {
        onSuccess: () => resolve(true),
        onError: () => resolve(false),
      });
    });
  }
}

// Usage
const jobsToCreate: CreateJobInput[] = [
  {
    title: 'Developer 1',
    company: 'Company A',
    // ... other fields
  },
  {
    title: 'Developer 2',
    company: 'Company B',
    // ... other fields
  },
];

createMultipleJobs(jobsToCreate);
```

---

### Form Component with Validation

```typescript
import { useState } from 'react';
import { useCreateJob } from '@/hooks/useAdminMutations';
import { CreateJobInput, createJobSchema } from '@workspace/api-zod';
import { useToast } from '@/hooks/use-toast';

function JobForm() {
  const { toast } = useToast();
  const createJobMut = useCreateJob();
  const [formData, setFormData] = useState<Partial<CreateJobInput>>({
    openings: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate with Zod
      const validated = createJobSchema.parse(formData);
      
      // Submit
      createJobMut.mutate(validated, {
        onSuccess: () => {
          toast({ title: 'Success', description: 'Job created' });
          setFormData({ openings: 1 });
        },
        onError: (error: any) => {
          toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive',
          });
        },
      });
    } catch (error: any) {
      toast({
        title: 'Validation Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Job Title</label>
        <input
          type="text"
          required
          value={formData.title || ''}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg"
          minLength={2}
          maxLength={255}
        />
      </div>

      <div>
        <label>Company</label>
        <input
          type="text"
          required
          value={formData.company || ''}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg"
          minLength={2}
          maxLength={255}
        />
      </div>

      <div>
        <label>Category</label>
        <select
          required
          value={formData.category || ''}
          onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="">Select Category</option>
          <option value="IT">IT</option>
          <option value="NON_IT">Non-IT</option>
          <option value="STATE_GOVT">State Govt</option>
          <option value="CENTRAL_GOVT">Central Govt</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={createJobMut.isPending}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {createJobMut.isPending ? 'Creating...' : 'Create Job'}
      </button>
    </form>
  );
}

export default JobForm;
```

---

### Nested Data Management Example

```typescript
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useCreateCollegeCutoff, useDeleteCollegeCutoff } from '@/hooks/useAdminMutations';
import { CreateCollegeCutoffInput } from '@workspace/api-zod';

function ManageCollegeCutoffs({ collegeId }: { collegeId: number }) {
  const [showForm, setShowForm] = useState(false);
  const [cutoffData, setCutoffData] = useState<Partial<CreateCollegeCutoffInput>>({});
  
  const { data: college } = useQuery({
    queryKey: ['college', collegeId],
    queryFn: () => fetch(`/api/admin/colleges`).then(r => r.json()),
  });

  const createCutoffMut = useCreateCollegeCutoff();
  const deleteCutoffMut = useDeleteCollegeCutoff();

  const handleAddCutoff = () => {
    createCutoffMut.mutate({
      collegeId,
      ...cutoffData,
    } as CreateCollegeCutoffInput, {
      onSuccess: () => {
        setCutoffData({});
        setShowForm(false);
      },
    });
  };

  const collegeCutoffs = college?.find((c: any) => c.id === collegeId)?.cutoffs || [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Cutoffs</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
        >
          Add Cutoff
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-3 border">
          <input
            type="text"
            placeholder="Course Name"
            value={cutoffData.courseName || ''}
            onChange={(e) => setCutoffData({ ...cutoffData, courseName: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />
          <input
            type="number"
            placeholder="Cutoff Score"
            value={cutoffData.cutoffScore || ''}
            onChange={(e) => setCutoffData({ ...cutoffData, cutoffScore: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />
          <input
            type="number"
            placeholder="UG Seats"
            value={cutoffData.ugSeats || ''}
            onChange={(e) => setCutoffData({ ...cutoffData, ugSeats: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />
          <input
            type="number"
            placeholder="PG Seats"
            value={cutoffData.pgSeats || ''}
            onChange={(e) => setCutoffData({ ...cutoffData, pgSeats: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddCutoff}
              disabled={createCutoffMut.isPending}
              className="flex-1 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
            >
              {createCutoffMut.isPending ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => { setShowForm(false); setCutoffData({}); }}
              className="flex-1 px-3 py-1 bg-gray-400 text-white text-sm rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {collegeCutoffs.map((cutoff: any) => (
          <div key={cutoff.id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
            <div>
              <p className="font-medium">{cutoff.courseName}</p>
              <p className="text-xs text-gray-600">Score: {cutoff.cutoffScore} | Seats: {cutoff.ugSeats}/{cutoff.pgSeats}</p>
            </div>
            <button
              onClick={() => deleteCutoffMut.mutate(cutoff.id)}
              className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageCollegeCutoffs;
```

---

### Real-World Form Integration

```typescript
import { useState } from 'react';
import { useCreateCollege, useCreateCollegeCutoff, useCreateCollegeFee } from '@/hooks/useAdminMutations';
import { CreateCollegeInput, CreateCollegeCutoffInput, CreateCollegeFeeInput } from '@workspace/api-zod';

interface CollegeFormData extends CreateCollegeInput {
  cutoffs?: CreateCollegeCutoffInput[];
  fees?: CreateCollegeFeeInput[];
}

function CreateCompleteCollege() {
  const createCollegeMut = useCreateCollege();
  const createCutoffMut = useCreateCollegeCutoff();
  const createFeeMut = useCreateCollegeFee();
  
  const [formData, setFormData] = useState<Partial<CollegeFormData>>({
    facilities: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create college first
    createCollegeMut.mutate(
      {
        name: formData.name!,
        location: formData.location!,
        city: formData.city!,
        state: formData.state!,
        // ... other fields
      },
      {
        onSuccess: (newCollege) => {
          // Then create cutoffs
          formData.cutoffs?.forEach((cutoff) => {
            createCutoffMut.mutate({
              ...cutoff,
              collegeId: newCollege.id,
            });
          });

          // Then create fees
          formData.fees?.forEach((fee) => {
            createFeeMut.mutate({
              ...fee,
              collegeId: newCollege.id,
            });
          });
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* College Section */}
      <div className="space-y-4">
        <h3 className="font-bold">College Details</h3>
        {/* College form fields */}
      </div>

      {/* Cutoffs Section */}
      <div className="space-y-4">
        <h3 className="font-bold">Cutoffs</h3>
        {formData.cutoffs?.map((cutoff, idx) => (
          <div key={idx} className="bg-gray-50 p-4 rounded-lg">
            {/* Cutoff form fields */}
          </div>
        ))}
        <button
          type="button"
          onClick={() => setFormData({
            ...formData,
            cutoffs: [...(formData.cutoffs || []), {}],
          })}
          className="px-4 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
        >
          Add Cutoff
        </button>
      </div>

      {/* Fees Section */}
      <div className="space-y-4">
        <h3 className="font-bold">Fees</h3>
        {formData.fees?.map((fee, idx) => (
          <div key={idx} className="bg-gray-50 p-4 rounded-lg">
            {/* Fee form fields */}
          </div>
        ))}
        <button
          type="button"
          onClick={() => setFormData({
            ...formData,
            fees: [...(formData.fees || []), {}],
          })}
          className="px-4 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
        >
          Add Fee
        </button>
      </div>

      <button
        type="submit"
        disabled={createCollegeMut.isPending}
        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        {createCollegeMut.isPending ? 'Creating...' : 'Create College'}
      </button>
    </form>
  );
}
```

---

### Error Handling with Retry Logic

```typescript
import { useCreateJob } from '@/hooks/useAdminMutations';
import { CreateJobInput } from '@workspace/api-zod';
import { useToast } from '@/hooks/use-toast';

function JobFormWithRetry() {
  const { toast } = useToast();
  const createJobMut = useCreateJob();
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const handleSubmit = async (data: CreateJobInput) => {
    try {
      createJobMut.mutate(data, {
        onSuccess: () => {
          setRetryCount(0);
          toast({ title: 'Success', description: 'Job created' });
        },
        onError: (error: any) => {
          if (retryCount < MAX_RETRIES) {
            toast({
              title: 'Error',
              description: `Retrying... (Attempt ${retryCount + 1}/${MAX_RETRIES})`,
            });
            setRetryCount(retryCount + 1);
            // Retry after delay
            setTimeout(() => handleSubmit(data), 2000);
          } else {
            toast({
              title: 'Error',
              description: `Failed after ${MAX_RETRIES} attempts: ${error.message}`,
              variant: 'destructive',
            });
          }
        },
      });
    } catch (error: any) {
      toast({
        title: 'Validation Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div>
      {/* Form */}
    </div>
  );
}
```

---

## Useful Constants

```typescript
// Job categories
const JOB_CATEGORIES = ['IT', 'NON_IT', 'STATE_GOVT', 'CENTRAL_GOVT'] as const;

// Shift types
const SHIFTS = ['Day', 'Night', 'Full_time', 'Part_time'] as const;

// Study material types
const MATERIAL_TYPES = ['PDF', 'Video', 'Notes', 'Practice_Test'] as const;

// Course types
const COURSE_TYPES = ['UG', 'PG'] as const;

// Status colors (from AdminPanel)
const STATUS_COLORS = {
  'Pre-Registered': 'bg-slate-100 text-slate-800 border-slate-200',
  'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Reviewed': 'bg-blue-100 text-blue-800 border-blue-200',
  'Interview': 'bg-purple-100 text-purple-800 border-purple-200',
  'Offered': 'bg-green-100 text-green-800 border-green-200',
  'Rejected': 'bg-red-100 text-red-800 border-red-200',
};
```

---

## Testing Tips

```typescript
// Test creating a job
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import JobForm from './JobForm';

describe('JobForm', () => {
  it('should create a job', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <JobForm />
      </QueryClientProvider>
    );

    fireEvent.change(screen.getByLabelText('Job Title'), {
      target: { value: 'Senior Developer' },
    });

    fireEvent.click(screen.getByText('Create Job'));

    await waitFor(() => {
      expect(screen.getByText('Job created successfully')).toBeInTheDocument();
    });
  });
});
```

---

**All code examples are production-ready and follow OpportuNet's coding standards.**
