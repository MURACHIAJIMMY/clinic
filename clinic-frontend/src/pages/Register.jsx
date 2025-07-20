

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { Button } from '@/components/ui/button';
import Button from "@/components/ui/button"; // ⬅️ no curly braces!
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '@/lib/axios';
import { Eye, EyeOff } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    gender: '',
    age: '',
    role: 'patient',
    specialization: '', // 👈 added
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      toast.success('Account created! Please login');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4"
      style={{ backgroundImage: "url('/bg-medical.jpg')" }}
    >
      <div className="w-full max-w-md bg-white bg-opacity-90 backdrop-blur-md p-6 rounded shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-bold text-center text-blue-800">Create your account</h2>

          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              name="name"
              id="name"
              placeholder="Your full name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="example@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                placeholder="Create a secure password"
                value={form.password}
                onChange={handleChange}
                className="pr-10"
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

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              type="tel"
              name="phone"
              id="phone"
              placeholder="e.g. 0700-123-456"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full p-2 border rounded text-gray-700"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex-1">
              <Label htmlFor="age">Age</Label>
              <Input
                type="number"
                name="age"
                id="age"
                min={0}
                placeholder="e.g. 30"
                value={form.age}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full p-2 border rounded text-gray-700"
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>

          {form.role === 'doctor' && (
            <div>
              <Label htmlFor="specialization">Specialization</Label>
              <Input
                type="text"
                name="specialization"
                id="specialization"
                placeholder="e.g. Cardiologist, Dentist, Surgeon"
                value={form.specialization}
                onChange={handleChange}
              />
            </div>
          )}

          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" type="submit">
            Register
          </Button>

          <p className="text-sm text-center text-gray-700">
            Already have an account?
            <a href="/login" className="ml-1 text-blue-600 hover:underline">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
