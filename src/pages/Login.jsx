/** Login.jsx (admin) - rejects any non-admin account. */
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Cross } from 'lucide-react';
import { useAdminLogin } from '@/hooks/useAuth';
import { Input, Label, FieldError } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { getErrorMessage } from '@/lib/axios';
import { toast } from '@/components/ui/Toast';

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAdminLogin();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = (values) =>
    login.mutate(values, {
      onSuccess: () => navigate(location.state?.from?.pathname || '/', { replace: true }),
      onError: (e) => toast.error(getErrorMessage(e)),
    });

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper p-4">
      <div className="w-full max-w-sm rounded-lg border border-line bg-surface p-7">
        <div className="mb-6 flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand text-white"><Cross className="h-5 w-5" strokeWidth={2.5} /></span>
          <span className="text-lg font-bold tracking-tight">Sunvale</span>
          <span className="ml-1 rounded bg-ink/5 px-1.5 py-0.5 text-[11px] font-medium text-ink-soft">Admin</span>
        </div>
        <h1 className="mb-6 text-xl font-semibold text-ink">Sign in to the admin panel</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" {...register('email')} />
            <FieldError>{errors.email?.message}</FieldError>
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" autoComplete="current-password" {...register('password')} />
            <FieldError>{errors.password?.message}</FieldError>
          </div>
          <Button type="submit" variant="primary" className="w-full" isLoading={login.isPending}>Sign in</Button>
        </form>
      </div>
    </div>
  );
}
