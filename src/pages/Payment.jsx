import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { PersonalInfoStep, CompanyInfoStep, PaymentInfoStep } from '@/components/PaymentSteps';
import { Lock } from 'lucide-react';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp } = useAuth();
  
  const plan = location.state?.plan;

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    companyName: '',
    jobTitle: '',
    companySize: '',
    industry: 'Oil & Gas',
    country: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: '',
    city: '',
    zipCode: ''
  });

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  if (!plan) {
    navigate('/pricing');
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateStep = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return formData.fullName && formData.email && formData.password && formData.confirmPassword && formData.phone;
      case 2:
        return formData.companyName && formData.jobTitle && formData.companySize && formData.country;
      case 3:
        return formData.cardNumber && formData.expiryDate && formData.cvv && formData.cardholderName;
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    if (step === 1 && formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
        duration: 4000,
      });
      return;
    }

    if (validateStep(step)) {
      setStep(step + 1);
    } else {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
        duration: 4000,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signUp(formData.email, formData.password);
    
    if (!error) {
      // Assuming signUp logs the user in (email confirmation disabled on Supabase)
      const subscriptionData = {
        plan: plan.name,
        billingCycle: plan.billingCycle,
        price: plan.selectedPrice,
        startDate: new Date().toISOString(),
        companyInfo: {
          name: formData.companyName,
          jobTitle: formData.jobTitle,
          size: formData.companySize,
          country: formData.country
        }
      };
      
      localStorage.setItem('petrolord_subscription', JSON.stringify(subscriptionData));

      toast({
        title: "Payment Successful! 🎉",
        description: `Welcome to Petrolord Suite ${plan.name} plan! Your account is now active.`,
        duration: 5000,
      });

      navigate('/dashboard');
    }
    // Error is handled by the context's toast.
    setLoading(false);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <PersonalInfoStep formData={formData} handleInputChange={handleInputChange} />;
      case 2:
        return <CompanyInfoStep formData={formData} handleInputChange={handleInputChange} />;
      case 3:
        return <PaymentInfoStep formData={formData} handleInputChange={handleInputChange} plan={plan} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Payment - Petrolord Suite</title>
        <meta name="description" content="Complete your Petrolord Suite subscription payment." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-lime-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-4xl"
        >
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl">
            {/* Header with Logo */}
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center space-x-3 hover:opacity-80 transition-opacity mb-6">
                <img 
                  src="https://storage.googleapis.com/hostinger-horizons-assets-prod/43fa5c4b-d185-4d6d-9ff4-a1d78861fb87/85e34dd4cd51b193045712640dd8acd3.png" 
                  alt="Petrolord Brand Icon" 
                  className="w-12 h-12 object-contain"
                />
                <span className="text-2xl font-bold text-white">Petrolord Suite</span>
              </Link>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                {[1, 2, 3].map((stepNumber) => (
                  <div key={stepNumber} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                      step >= stepNumber 
                        ? 'bg-gradient-to-r from-lime-500 to-orange-500 text-white' 
                        : 'bg-white/20 text-lime-300'
                    }`}>
                      {stepNumber}
                    </div>
                    {stepNumber < 3 && (
                      <div className={`w-16 h-1 mx-2 ${
                        step > stepNumber ? 'bg-gradient-to-r from-lime-500 to-orange-500' : 'bg-white/20'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-sm text-lime-200">
                <span>Personal Info</span>
                <span>Company Info</span>
                <span>Payment</span>
              </div>
            </div>

            <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNextStep(); }}>
              {renderStep()}

              <div className="flex justify-between mt-8">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                    className="border-white/20 text-lime-200 hover:bg-white/10"
                  >
                    Previous
                  </Button>
                )}
                
                <Button
                  type="submit"
                  disabled={loading || !validateStep(step)}
                  className={`${step === 1 ? 'ml-auto' : ''} bg-gradient-to-r from-lime-600 to-orange-600 hover:from-lime-700 hover:to-orange-700 text-white font-semibold px-8`}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : step === 3 ? (
                    <div className="flex items-center">
                      <Lock className="w-4 h-4 mr-2" />
                      Complete Payment
                    </div>
                  ) : (
                    'Next Step'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Payment;