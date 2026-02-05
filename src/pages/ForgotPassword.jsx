import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Mail, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await resetPassword(email);
    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password - Petrolord</title>
        <meta name="description" content="Reset your Petrolord account password." />
      </Helmet>
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-lime-300">Forgot Password</h1>
              <p className="text-slate-400 mt-2">Enter your email to get a reset link</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-lime-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-slate-900/50 border-slate-700 focus:border-lime-400"
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-lime-400 to-teal-500 hover:from-lime-500 hover:to-teal-600 text-slate-900 font-bold">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                Send Reset Link
              </Button>
            </form>
            <p className="text-center text-sm text-slate-400 mt-8">
              Remember your password?{' '}
              <Link to="/login" className="font-medium text-lime-400 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ForgotPassword;