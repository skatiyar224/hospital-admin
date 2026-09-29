/**
 * DepartmentFormModal.jsx - create/edit in a modal. `services` (bullet
 * list shown on the public department page) is entered one per line and
 * sent as a JSON array string, matching the backend's parseJsonFields.
 */
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ImagePlus } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input, Label, Textarea, FieldError } from '@/components/ui/Input';
import { useCreateDepartment, useUpdateDepartment } from '@/hooks/useDepartments';
import { resolveImage } from '@/lib/axios';
import { DEPARTMENT_ICON_OPTIONS } from './icons';
import { Select } from '@/components/ui/Select';

const schema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(60),
  icon: z.string().optional(),
  shortDescription: z.string().max(200).optional(),
  description: z.string().max(3000).optional(),
  services: z.string().optional(),
  displayOrder: z.string().optional(),
});

function DepartmentForm({ department, onDone }) {
  const isEdit = Boolean(department);
  const create = useCreateDepartment();
  const update = useUpdateDepartment();
  const [file, setFile] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: department?.name || '',
      icon: department?.icon || 'stethoscope',
      shortDescription: department?.shortDescription || '',
      description: department?.description || '',
      services: department?.services?.join('\n') || '',
      displayOrder: department?.displayOrder != null ? String(department.displayOrder) : '0',
    },
  });

  const preview = useMemo(() => (file ? URL.createObjectURL(file) : resolveImage(department?.image)), [file, department?.image]);
  const isPending = create.isPending || update.isPending;

  const onSubmit = (values) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('icon', values.icon || 'stethoscope');
    formData.append('shortDescription', values.shortDescription || '');
    formData.append('description', values.description || '');
    formData.append('displayOrder', values.displayOrder || '0');
    formData.append('services', JSON.stringify((values.services || '').split('\n').map((s) => s.trim()).filter(Boolean)));
    if (file) formData.append('image', file);

    const options = { onSuccess: onDone };
    if (isEdit) update.mutate({ id: department._id, formData }, options);
    else create.mutate(formData, options);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex items-center gap-4">
        {preview ? (
          <img src={preview} alt="" className="h-14 w-14 rounded-lg border border-line object-cover" />
        ) : (
          <div className="grid h-14 w-14 place-items-center rounded-lg border border-dashed border-line text-ink-soft"><ImagePlus className="h-5 w-5" /></div>
        )}
        <label className="cursor-pointer text-sm font-medium text-brand-dark hover:underline">
          {preview ? 'Change image' : 'Add image'}
          <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" hidden onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register('name')} />
          <FieldError>{errors.name?.message}</FieldError>
        </div>
        <div>
          <Label htmlFor="icon">Icon</Label>
          <Select id="icon" className="w-full" {...register('icon')}>
            {DEPARTMENT_ICON_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="shortDescription">Short description</Label>
        <Input id="shortDescription" placeholder="Shown on department cards" {...register('shortDescription')} />
      </div>
      <div>
        <Label htmlFor="description">Full description</Label>
        <Textarea id="description" rows={3} {...register('description')} />
      </div>
      <div>
        <Label htmlFor="services">Services (one per line)</Label>
        <Textarea id="services" rows={4} placeholder={'ECG and stress testing\nEchocardiography'} {...register('services')} />
      </div>
      <div>
        <Label htmlFor="displayOrder">Display order</Label>
        <Input id="displayOrder" type="number" min="0" className="w-32" {...register('displayOrder')} />
        <p className="mt-1 text-xs text-ink-soft">Lower numbers appear first.</p>
      </div>

      <div className="flex justify-end gap-2 border-t border-line pt-4">
        <Button type="button" variant="outline" onClick={onDone}>Cancel</Button>
        <Button type="submit" variant="primary" isLoading={isPending}>{isEdit ? 'Save changes' : 'Create department'}</Button>
      </div>
    </form>
  );
}

export function DepartmentFormModal({ open, onClose, department }) {
  return (
    <Modal open={open} onClose={onClose} title={department ? 'Edit department' : 'New department'} className="max-w-lg max-h-[90vh] overflow-y-auto">
      {open && <DepartmentForm key={department?._id || 'new'} department={department} onDone={onClose} />}
    </Modal>
  );
}
