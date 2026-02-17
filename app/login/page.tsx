'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isLightOn, setIsLightOn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login - replace with actual auth logic
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#151f28] overflow-hidden relative px-4 py-8">
      {/* Glowing light at top */}
      <div 
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-[280px] sm:w-[500px] h-2 sm:h-2.5 rounded-full transition-all duration-500 ${
          isLightOn 
            ? 'bg-primary shadow-[0_0_30px_10px_var(--primary),0_0_60px_20px_var(--primary)]' 
            : 'bg-gray-600'
        }`}
      />

      {/* Login Box */}
      <div className="relative w-full max-w-[400px]">
        {/* Toggle Switch - Desktop only (hidden on mobile) */}
        <div className="absolute -right-[70px] top-5 z-20 hidden md:block">
          <label 
            className="relative block w-[60px] h-[120px] bg-white/10 backdrop-blur-md border border-white/20 rounded-[10px] cursor-pointer shadow-lg"
            onClick={() => setIsLightOn(!isLightOn)}
          >
            {/* Track */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-[80%] bg-black rounded-full" />
            
            {/* Knob */}
            <div 
              className={`absolute left-1/2 -translate-x-1/2 w-[45px] h-[45px] bg-[#333] border-2 border-[#191919] rounded-[10px] shadow-lg transition-all duration-500 ${
                isLightOn ? 'top-[65px]' : 'top-[5px]'
              }`}
            />

            {/* OFF text */}
            <span 
              className={`absolute left-1/2 -translate-x-1/2 text-sm font-medium uppercase transition-all duration-500 z-10 ${
                isLightOn ? 'top-[76px] opacity-0' : 'top-[17px] opacity-100 text-white'
              }`}
            >
              off
            </span>

            {/* ON text */}
            <span 
              className={`absolute left-1/2 -translate-x-1/2 text-sm font-medium uppercase transition-all duration-500 z-10 ${
                isLightOn 
                  ? 'top-[76px] opacity-100 text-primary neon-text-glow' 
                  : 'top-[17px] opacity-0 text-white'
              }`}
            >
              on
            </span>
          </label>
        </div>

        {/* Main Card - Glassmorphism */}
        <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-[20px] p-6 sm:p-8 md:p-10 overflow-hidden shadow-2xl">
          {/* Mobile Toggle Button */}
          <button
            type="button"
            onClick={() => setIsLightOn(!isLightOn)}
            className={`md:hidden absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-500 z-20 ${
              isLightOn 
                ? 'bg-primary text-[#191919] shadow-[0_0_10px_var(--primary)]' 
                : 'bg-white/20 text-white border border-white/30'
            }`}
          >
            {isLightOn ? '✨ ON' : 'OFF'}
          </button>
          {/* Light beam effect */}
          <div 
            className={`absolute left-0 w-full h-[950px] pointer-events-none transition-all duration-500 ease-out ${
              isLightOn ? '-top-[90%]' : '-top-[200%]'
            }`}
            style={{
              background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.3) -50%, rgba(255, 255, 255, 0) 90%)',
              clipPath: 'polygon(20% 0, 80% 0, 100% 100%, 0 100%)',
            }}
          />

          <form onSubmit={handleSubmit} className="relative z-10 pt-8 md:pt-0">
            {/* Title */}
            <h2 
              className={`text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 transition-all duration-500 ${
                isLightOn ? 'text-primary neon-text-glow' : 'text-white'
              }`}
            >
              Login
            </h2>

            {/* Email Input */}
            <div className="relative mb-6 sm:mb-8">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`w-full h-[45px] sm:h-[50px] bg-transparent border-none outline-none text-sm sm:text-base pr-10 pl-1 peer transition-all duration-500 ${
                  isLightOn ? 'text-primary neon-text-glow-subtle' : 'text-white'
                }`}
              />
              <label 
                className={`absolute top-1/2 left-1 -translate-y-1/2 text-sm sm:text-base pointer-events-none transition-all duration-300 
                  peer-focus:top-[-5px] peer-valid:top-[-5px] peer-focus:text-xs peer-valid:text-xs sm:peer-focus:text-sm sm:peer-valid:text-sm ${
                  isLightOn ? 'text-primary neon-text-glow-subtle' : 'text-white'
                }`}
              >
                Email
              </label>
              <span 
                className={`absolute right-2 top-1/2 -translate-y-1/2 transition-all duration-500 ${
                  isLightOn ? 'text-primary neon-icon-glow' : 'text-white'
                }`}
              >
                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
              </span>
              <div 
                className={`absolute bottom-0 left-0 w-full h-[2.5px] transition-all duration-500 ${
                  isLightOn ? 'bg-primary shadow-[0_0_10px_var(--primary)]' : 'bg-white'
                }`}
              />
            </div>

            {/* Password Input */}
            <div className="relative mb-6 sm:mb-8">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full h-[45px] sm:h-[50px] bg-transparent border-none outline-none text-sm sm:text-base pr-16 pl-1 peer transition-all duration-500 ${
                  isLightOn ? 'text-primary neon-text-glow-subtle' : 'text-white'
                }`}
              />
              <label 
                className={`absolute top-1/2 left-1 -translate-y-1/2 text-sm sm:text-base pointer-events-none transition-all duration-300 
                  peer-focus:top-[-5px] peer-valid:top-[-5px] peer-focus:text-xs peer-valid:text-xs sm:peer-focus:text-sm sm:peer-valid:text-sm ${
                  isLightOn ? 'text-primary neon-text-glow-subtle' : 'text-white'
                }`}
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-8 sm:right-10 top-1/2 -translate-y-1/2 transition-all duration-500 ${
                  isLightOn ? 'text-primary neon-icon-glow' : 'text-white'
                }`}
              >
                {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
              <span 
                className={`absolute right-2 top-1/2 -translate-y-1/2 transition-all duration-500 ${
                  isLightOn ? 'text-primary neon-icon-glow' : 'text-white'
                }`}
              >
                <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
              </span>
              <div 
                className={`absolute bottom-0 left-0 w-full h-[2.5px] transition-all duration-500 ${
                  isLightOn ? 'bg-primary shadow-[0_0_10px_var(--primary)]' : 'bg-white'
                }`}
              />
            </div>

            {/* Remember / Forgot */}
            <div 
              className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 text-xs sm:text-sm mb-6 transition-all duration-500 ${
                isLightOn ? 'text-primary neon-text-glow-subtle' : 'text-white'
              }`}
            >
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className={`w-4 h-4 rounded transition-all duration-500 ${
                    isLightOn ? 'accent-primary' : 'accent-white'
                  }`}
                />
                Remember me
              </label>
              <Link 
                href="/forgot-password" 
                className={`hover:underline transition-colors ${
                  isLightOn ? 'text-primary' : 'text-white'
                }`}
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full h-10 sm:h-11 rounded-full font-medium text-sm sm:text-base transition-all duration-500 disabled:opacity-70 ${
                isLightOn 
                  ? 'bg-primary text-[#191919] shadow-[0_0_15px_var(--primary),0_0_30px_var(--primary)]' 
                  : 'bg-white text-[#191919]'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Logging in...
                </span>
              ) : 'Login'}
            </button>

            {/* Register Link */}
            <p 
              className={`text-center text-xs sm:text-sm mt-5 sm:mt-6 transition-all duration-500 ${
                isLightOn ? 'text-primary neon-text-glow-subtle' : 'text-white'
              }`}
            >
              Don't have an account?{' '}
              <Link 
                href="/signup" 
                className={`font-semibold hover:underline transition-colors ${
                  isLightOn ? 'text-primary' : 'text-white'
                }`}
              >
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Background glow effect when light is on */}
      <div 
        className={`fixed inset-0 pointer-events-none transition-opacity duration-700 ${
          isLightOn ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'radial-gradient(ellipse at 50% -20%, rgba(var(--primary-rgb), 0.15) 0%, transparent 60%)',
        }}
      />
    </div>
  );
}
