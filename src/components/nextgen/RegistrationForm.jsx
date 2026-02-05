import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2 } from 'lucide-react';

const RegistrationForm = () => {
  const { register, handleSubmit, formState: { errors }, reset, control, setValue } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const categories = [
    "Student",
    "Young Professional",
    "Mentor",
    "Lecturer",
    "Other"
  ];

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('nextgen_registrations')
        .insert([
          { 
            full_name: data.fullName, 
            email: data.email, 
            category: data.category,
            institution: data.institution,
            details: {
              // You can add more fields here if needed in the future
            }
          }
        ]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          throw new Error('This email address has already been registered.');
        }
        throw error;
      }

      toast({
        title: "✅ Registration Successful!",
        description: "Welcome to Petrolord NextGen! We're excited to have you.",
        className: "bg-green-500 text-white",
      });
      reset();
    } catch (error) {
      toast({
        title: "❌ Registration Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-slate-300">Full Name</Label>
        <Input
          id="fullName"
          placeholder="e.g., Ada Lovelace"
          className="bg-slate-700 border-slate-600 text-white"
          {...register("fullName", { required: "Full name is required" })}
        />
        {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-slate-300">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          className="bg-slate-700 border-slate-600 text-white"
          {...register("email", { 
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address"
            }
          })}
        />
        {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category" className="text-slate-300">Category</Label>
        <Select onValueChange={(value) => setValue('category', value, { shouldValidate: true })}>
           <SelectTrigger id="category" className="bg-slate-700 border-slate-600 text-white">
            <SelectValue placeholder="Select your category..." />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700 text-white">
            {categories.map(cat => (
              <SelectItem key={cat} value={cat} className="cursor-pointer hover:!bg-slate-700">{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
         <input type="hidden" {...register("category", { required: "Please select a category" })} />
        {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="institution" className="text-slate-300">University / Company</Label>
        <Input
          id="institution"
          placeholder="e.g., University of Lagos or Shell"
          className="bg-slate-700 border-slate-600 text-white"
          {...register("institution", { required: "Your institution is required" })}
        />
        {errors.institution && <p className="text-red-400 text-sm mt-1">{errors.institution.message}</p>}
      </div>

      <Button type="submit" className="w-full bg-gradient-to-r from-lime-400 to-cyan-500 hover:from-lime-500 hover:to-cyan-600 text-slate-900 font-bold text-lg py-6" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Submitting...
          </>
        ) : (
          "Register Now"
        )}
      </Button>
    </form>
  );
};

export default RegistrationForm;