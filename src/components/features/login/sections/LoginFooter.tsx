import { ShieldCheck } from 'lucide-react';

const LoginFooter = () => {
  return (
    <footer className="p-4 text-center text-xs text-[var(--text-muted)]">
      <div className="flex items-center justify-center gap-1.5">
        <ShieldCheck className="h-4 w-4 text-[var(--primary)]" />
        <span>Mot7km SaaS Platform &copy; 2026. All rights reserved.</span>
      </div>
    </footer>
  );
};

export default LoginFooter;