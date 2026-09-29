/**
 * DoctorFormSheet.jsx
 * ------------------------------------------------------------------
 * Create/edit doctor in a slide-over. Submits multipart/form-data;
 * `qualifications`, `languages`, `availability` are sent as JSON
 * strings (the backend's parseJsonFields middleware parses them back
 * before validation — see hospital-backend routes/admin/admin.doctor.routes.js).
 * ------------------------------------------------------------------
 */
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ImagePlus } from 'lucide-react';
import { Sheet } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input, Label, Textarea, FieldError } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { AvailabilityEditor } from './AvailabilityEditor';
import { useAdminDepartments } from '@/hooks/useDepartments';
import { useCreateDoctor, useUpdateDoctor } from '@/hooks/useDoctors';
import { resolveImage } from '@/lib/axios';

const listField = (label) =>
  z.string().optional().transform((v) => (v ? v.split(',').map((s) => s.trim()).filter(Boolean) : []));

const schema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(80),
  department: z.string().min(1, 'Choose a department'),
  designation: z.string().optional(),
  specialization: z.string().optional(),
  qualifications: listField(),
  languages: listField(),
  experienceYears: z.string().optional().refine((v) => !v || (Number.isInteger(Number(v)) && Number(v) >= 0), 'Whole number, 0 or more'),
  gender: z.string().optional(),
  consultationFee: z.string().refine((v) => v !== '' && Number(v) >= 0, 'Enter a valid fee'),
  bio: z.string().max(3000).optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  isAcceptingAppointments: z.boolean().optional(),
});

function DoctorForm({ doctor, onDone }) {
  const isEdit = Boolean(doctor);
  const { data: departments } = useAdminDepartments();
  const createDoctor = useCreateDoctor();
  const updateDoctor = useUpdateDoctor();
  const [file, setFile] = useState(null);
  const [availability, setAvailability] = useState(doctor?.availability || []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: doctor?.name || '',
      department: doctor?.department?._id || doctor?.department || '',
      designation: doctor?.designation || '',
      specialization: doctor?.specialization || '',
      qualifications: doctor?.qualifications?.join(', ') || '',
      languages: doctor?.languages?.join(', ') || '',
      experienceYears: doctor?.experienceYears != null ? String(doctor.experienceYears) : '',
      gender: doctor?.gender || '',
      consultationFee: doctor?.consultationFee != null ? String(doctor.consultationFee) : '',
      bio: doctor?.bio || '',
      isFeatured: doctor?.isFeatured || false,
      isActive: doctor?.isActive ?? true,
      isAcceptingAppointments: doctor?.isAcceptingAppointments ?? true,
    },
  });

  const preview = useMemo(() => (file ? URL.createObjectURL(file) : resolveImage(doctor?.image)), [file, doctor?.image]);
  const isPending = createDoctor.isPending || updateDoctor.isPending;

  const invalidWindow = availability.some((w) => w.startTime >= w.endTime);

  const onSubmit = (values) => {
    if (invalidWindow) return;

    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('department', values.department);
    formData.append('designation', values.designation || '');
    formData.append('specialization', values.specialization || '');
    formData.append('experienceYears', values.experienceYears || '0');
    formData.append('gender', values.gender || '');
    formData.append('consultationFee', values.consultationFee);
    formData.append('bio', values.bio || '');
    formData.append('qualifications', JSON.stringify(values.qualifications));
    formData.append('languages', JSON.stringify(values.languages));
    formData.append('availability', JSON.stringify(availability));
    formData.append('isFeatured', String(Boolean(values.isFeatured)));
    if (isEdit) {
      formData.append('isActive', String(Boolean(values.isActive)));
      formData.append('isAcceptingAppointments', String(Boolean(values.isAcceptingAppointments)));
    }
    if (file) formData.append('image', file);

    const options = { onSuccess: onDone };
    if (isEdit) updateDoctor.mutate({ id: doctor._id, formData }, options);
    else createDoctor.mutate(formData, options);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-5">
      <div className="flex items-center gap-4">
        {preview ? (
          <img src={preview} alt="" className="h-16 w-16 rounded-full border border-line object-cover" />
        ) : (
          <div className="grid h-16 w-16 place-items-center rounded-full border border-dashed border-line text-ink-soft"><ImagePlus className="h-5 w-5" /></div>
        )}
        <label className="cursor-pointer text-sm font-medium text-brand-dark hover:underline">
          {preview ? 'Change photo' : 'Add photo'}
          <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" hidden onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input id="name" placeholder="Dr. Jane Doe" {...register('name')} />
          <FieldError>{errors.name?.message}</FieldError>
        </div>
        <div>
          <Label htmlFor="department">Department</Label>
          <Select id="department" className="w-full" {...register('department')}>
            <option value="">Select…</option>
            {departments?.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
          </Select>
          <FieldError>{errors.department?.message}</FieldError>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="designation">Designation</Label>
          <Input id="designation" placeholder="Senior Consultant" {...register('designation')} />
        </div>
        <div>
          <Label htmlFor="specialization">Specialization</Label>
          <Input id="specialization" placeholder="Interventional Cardiology" {...register('specialization')} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="experienceYears">Experience (years)</Label>
          <Input id="experienceYears" type="number" min="0" max="70" {...register('experienceYears')} />
          <FieldError>{errors.experienceYears?.message}</FieldError>
        </div>
        <div>
          <Label htmlFor="consultationFee">Consultation fee (₹)</Label>
          <Input id="consultationFee" type="number" min="0" step="1" {...register('consultationFee')} />
          <FieldError>{errors.consultationFee?.message}</FieldError>
        </div>
        <div>
          <Label htmlFor="gender">Gender</Label>
          <Select id="gender" className="w-full" {...register('gender')}>
            <option value="">—</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="qualifications">Qualifications (comma separated)</Label>
          <Input id="qualifications" placeholder="MBBS, MD Cardiology" {...register('qualifications')} />
        </div>
        <div>
          <Label htmlFor="languages">Languages (comma separated)</Label>
          <Input id="languages" placeholder="English, Hindi" {...register('languages')} />
        </div>
      </div>

      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" rows={3} {...register('bio')} />
        <FieldError>{errors.bio?.message}</FieldError>
      </div>

      <div>
        <Label>Weekly schedule</Label>
        <AvailabilityEditor value={availability} onChange={setAvailability} />
      </div>

      <div className="flex flex-wrap gap-6 border-t border-line pt-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="h-4 w-4 accent-brand" {...register('isFeatured')} /> Featured on home page
        </label>
        {isEdit && (
          <>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="h-4 w-4 accent-brand" {...register('isActive')} /> Visible on website
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="h-4 w-4 accent-brand" {...register('isAcceptingAppointments')} /> Accepting appointments
            </label>
          </>
        )}
      </div>

      <div className="flex justify-end gap-2 border-t border-line pt-4">
        <Button type="button" variant="outline" onClick={onDone}>Cancel</Button>
        <Button type="submit" variant="primary" isLoading={isPending}>{isEdit ? 'Save changes' : 'Create doctor'}</Button>
      </div>
    </form>
  );
}

export function DoctorFormSheet({ open, onClose, doctor }) {
  return (
    <Sheet open={open} onClose={onClose} title={doctor ? 'Edit doctor' : 'New doctor'} className="max-w-xl">
      {open && <DoctorForm key={doctor?._id || 'new'} doctor={doctor} onDone={onClose} />}
    </Sheet>
  );
}
