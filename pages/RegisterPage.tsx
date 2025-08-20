import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { Role } from '../types';

const GasFlameIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.378 1.602a.75.75 0 00-.756 0L3.322 6.034a.75.75 0 00-.322.648v7.634c0 .327.16.633.428.825l8.25 6.021a.75.75 0 00.944 0l8.25-6.021a.75.75 0 00.428-.825V6.682a.75.75 0 00-.322-.648L12.378 1.602zM12 7.5c-2.347 0-4.25 1.903-4.25 4.25S9.653 16 12 16s4.25-1.903 4.25-4.25S14.347 7.5 12 7.5z" />
    </svg>
);
const EmailIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
        <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
    </svg>
);
const LockIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
    </svg>
);
const UserGroupIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.41-1.412A6.962 6.962 0 0010 11.5c-2.25 0-4.337.894-5.91 2.256a1.23 1.23 0 00-.625.737zM16.121 15.89A8.452 8.452 0 0110 16.5c-1.756 0-3.41-.52-4.81-1.428a9.982 9.982 0 01-3.263-2.924.5.5 0 01.326-.825c.3-.065.625.09.793.362a8.473 8.473 0 0014.24 0c.168-.272.493-.427.793-.362a.5.5 0 01.326.825 9.982 9.982 0 01-3.263 2.924z" />
    </svg>
);

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>(Role.USER);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const user = await register({ email, password, role });
       if (user.role === Role.ADMIN) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center gradient-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 animate-fadeInUp">
        <div className="text-center">
            <div className="inline-block bg-slate-900/50 p-4 rounded-2xl mb-4">
              <GasFlameIcon className="mx-auto h-12 w-auto text-sky-400" />
            </div>
          <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-white">
            Create an account
          </h2>
           <p className="mt-2 text-sky-200/80">Join LPG Shield to report and track incidents</p>
        </div>
        <div className="bg-slate-200/20 backdrop-blur-xl shadow-2xl rounded-2xl p-8 space-y-6 border border-slate-300/30">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <div className="rounded-md bg-red-500/80 border border-red-700 p-3 text-sm text-white animate-fadeIn">{error}</div>}
            
            <div className="relative">
              <EmailIcon className="pointer-events-none w-5 h-5 text-slate-400 absolute top-1/2 transform -translate-y-1/2 left-3" />
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full rounded-md border-0 py-2.5 pl-10 bg-slate-100/80 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <LockIcon className="pointer-events-none w-5 h-5 text-slate-400 absolute top-1/2 transform -translate-y-1/2 left-3" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="block w-full rounded-md border-0 py-2.5 pl-10 bg-slate-100/80 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="relative">
                <UserGroupIcon className="pointer-events-none w-5 h-5 text-slate-400 absolute top-1/2 transform -translate-y-1/2 left-3" />
                <select 
                    id="role" 
                    name="role" 
                    value={role} 
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="block w-full appearance-none rounded-md border-0 py-2.5 pl-10 bg-slate-100/80 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm"
                >
                    <option value={Role.USER}>User (Customer)</option>
                    <option value={Role.ADMIN}>Admin (Agency)</option>
                </select>
            </div>
          

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full items-center justify-center rounded-md border border-transparent bg-gradient-to-r from-sky-500 to-cyan-500 py-2.5 px-4 text-sm font-semibold text-white hover:from-sky-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-60 transition-all duration-300 ease-in-out transform hover:shadow-lg hover:-translate-y-0.5"
              >
                {isLoading ? 'Creating account...' : 'Register'}
              </button>
            </div>
          </form>
        </div>
        <p className="text-center text-sm text-slate-300">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-sky-400 hover:text-sky-300 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;