
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '@/lib/axios';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', form);
      const user = res.data;

      localStorage.setItem('token', user.token);
      localStorage.setItem('user', JSON.stringify(user));

      toast.success('Welcome back!');

      if (user.role === 'doctor') {
        navigate('/dashboard');
      } else if (user.role === 'patient') {
        navigate('/book');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4"
      style={{ backgroundImage: "url('/bg-medical.jpg')" }}
    >
      <div className="w-full max-w-md bg-white bg-opacity-90 backdrop-blur-md p-6 rounded shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-bold text-center">
            Sign in to your clinic account ✒️✒️
          </h2>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              name="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              placeholder="example@example.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                name="password"
                id="password"
                value={form.password}
                onChange={handleChange}
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className="pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Login
          </Button>

          <p className="text-sm text-center">
            Don’t have an account?
            <a href="/register" className="ml-1 text-blue-600 hover:underline">
              Register
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
