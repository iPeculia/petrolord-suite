import React, { useState } from 'react';
    import { Helmet } from 'react-helmet';
    import { motion } from 'framer-motion';
    import { useToast } from '@/components/ui/use-toast';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { UserPlus, Loader2, ArrowLeft } from 'lucide-react';
    import { supabase } from '@/lib/customSupabaseClient';
    import { Link } from 'react-router-dom';

    const AdminCreateUser = () => {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [fullName, setFullName] = useState('');
      const [loading, setLoading] = useState(false);
      const [createdUsers, setCreatedUsers] = useState([]);
      const { toast } = useToast();

      const handleCreateUser = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { data, error } = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { full_name: fullName },
        });

        if (error) {
          toast({
            variant: 'destructive',
            title: 'Error Creating User',
            description: error.message,
          });
        } else {
          toast({
            title: 'User Created Successfully!',
            description: `Account for ${email} has been created.`,
          });
          setCreatedUsers([...createdUsers, { email, password, fullName }]);
          setEmail('');
          setPassword('');
          setFullName('');
        }
        setLoading(false);
      };

      const handleBatchCreate = async () => {
        setLoading(true);
        const usersToCreate = [
          { email: 'ayodejiasaolu1@gmail.com', password: 'AyodejiPassword@2025', fullName: 'Ayodeji Asaolu' },
          { email: 'ojooluwaseyi90@gmail.com', password: 'OjoPassword@2025', fullName: 'Ojo Oluwaseyi' },
        ];

        let createdCount = 0;
        const results = [];

        for (const user of usersToCreate) {
          const { data, error } = await supabase.auth.admin.createUser({
            email: user.email,
            password: user.password,
            email_confirm: true,
            user_metadata: { full_name: user.fullName },
          });

          if (error) {
            toast({
              variant: 'destructive',
              title: `Error creating ${user.email}`,
              description: error.message,
            });
          } else {
            results.push(user);
            createdCount++;
          }
        }
        
        setCreatedUsers(prev => [...prev, ...results]);
        toast({
          title: 'Batch Creation Complete',
          description: `${createdCount} of ${usersToCreate.length} users created successfully.`,
        });

        setLoading(false);
      }


      return (
        <>
          <Helmet>
            <title>Admin - Create User - Petrolord Suite</title>
            <meta name="description" content="Administrator page to create new user accounts." />
          </Helmet>
          <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-2xl"
            >
              <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-2xl p-8 shadow-2xl">
                <Link to="/dashboard">
                  <Button variant="outline" size="sm" className="mb-4 border-lime-400/50 text-lime-300 hover:bg-lime-500/20">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-bold text-lime-300">Admin User Creation</h1>
                  <p className="text-slate-400 mt-2">Create new user accounts directly.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1">
                        <h2 className="text-2xl font-semibold text-white mb-4">Create Single User</h2>
                        <form onSubmit={handleCreateUser} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="fullName" className="text-lime-300">Full Name</Label>
                                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="bg-slate-900/50 border-slate-700 focus:border-lime-400" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-lime-300">Email</Label>
                                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-slate-900/50 border-slate-700 focus:border-lime-400" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-lime-300">Password</Label>
                                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-slate-900/50 border-slate-700 focus:border-lime-400" />
                            </div>
                            <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-lime-400 to-teal-500 hover:from-lime-500 hover:to-teal-600 text-slate-900 font-bold">
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                                Create User
                            </Button>
                        </form>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-slate-700 pt-8 md:pt-0 md:pl-8">
                        <h2 className="text-2xl font-semibold text-white mb-4">Batch Create Users</h2>
                        <p className="text-slate-400 mb-4 text-center">Click to create accounts for:<br/> ayodejiasaolu1@gmail.com & ojooluwaseyi90@gmail.com</p>
                         <Button onClick={handleBatchCreate} disabled={loading} className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold">
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                            Create 2 New Users
                        </Button>
                    </div>
                </div>

                {createdUsers.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold text-white">Created User Credentials</h3>
                    <div className="mt-4 bg-slate-900/50 border border-slate-700 rounded-lg p-4 space-y-2">
                      {createdUsers.map((user, index) => (
                        <div key={index} className="text-sm">
                          <p><span className="font-bold text-lime-300">Email:</span> {user.email}</p>
                          <p><span className="font-bold text-lime-300">Password:</span> {user.password}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      );
    };

    export default AdminCreateUser;