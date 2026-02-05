import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { LogIn, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet';

const DirectLogin = () => {
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth(); // Added signUp
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await signIn('ayoasaolu@gmail.com', '-xj\\XEj!J1Zm2.HH');
    if (!error) {
      toast({
        title: 'Login Successful!',
        description: "Welcome back! Redirecting you to the dashboard...",
      });
      navigate('/dashboard', { replace: true });
    } else {
        toast({
            title: 'Login Failed',
            description: 'Please try again.',
            variant: 'destructive'
        })
    }
    setLoading(false);
  };

  // Function to create new users
  const createNewUsers = async () => {
    setLoading(true);
    const usersToCreate = [
      { email: 'ayodejiasaolu1@gmail.com', password: 'Ayodeji@2025', fullName: 'Ayodeji Asaolu' },
      { email: 'ojooluwaseyi90@gmail.com', password: 'Ojo@2025', fullName: 'Ojo Oluwaseyi' },
    ];

    for (const user of usersToCreate) {
      const { error } = await signUp(user.email, user.password, { data: { full_name: user.fullName } });
      if (error) {
        toast({
          title: `Failed to create user: ${user.email}`,
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: `User created: ${user.email}`,
          description: `Please check ${user.email} for a confirmation link. Password: ${user.password}`,
        });
      }
    }
    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Direct Login - Petrolord</title>
        <meta name="description" content="Direct login access for administrators." />
      </Helmet>
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md text-center"
        >
          <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-2xl p-8 shadow-2xl">
            <h1 className="text-3xl font-bold text-lime-300 mb-4">Direct Access</h1>
            <p className="text-slate-400 mb-8">Click the button below to log in to your account.</p>
            <Button onClick={handleLogin} disabled={loading} className="w-full bg-gradient-to-r from-lime-400 to-teal-500 hover:from-lime-500 hover:to-teal-600 text-slate-900 font-bold">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
              Login as Ayo Asaolu
            </Button>
            <Button onClick={createNewUsers} disabled={loading} className="w-full mt-4 bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white font-bold">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
              Create New Users
            </Button>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default DirectLogin;