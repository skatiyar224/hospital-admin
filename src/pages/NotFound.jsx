import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <p className="text-5xl font-semibold text-brand">404</p>
      <p className="mt-3 text-ink-soft">That admin page doesn't exist.</p>
      <Link to="/" className="mt-5 inline-block"><Button variant="primary">Back to dashboard</Button></Link>
    </div>
  );
}
