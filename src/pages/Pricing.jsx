import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Check, Star, Zap, Crown } from 'lucide-react';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for small teams and individual professionals',
      icon: Zap,
      color: 'from-lime-500 to-green-500',
      prices: {
        monthly: 99,
        annual: 89,
        lifetime: null
      },
      features: [
        'Access to 2 application categories',
        'Up to 5 projects',
        'Basic analytics and reporting',
        'Email support',
        '10GB storage',
        'Standard security features'
      ],
      popular: false
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Ideal for growing companies and project teams',
      icon: Star,
      color: 'from-orange-500 to-amber-500',
      prices: {
        monthly: 199,
        annual: 179,
        lifetime: null
      },
      features: [
        'Access to 4 application categories',
        'Up to 25 projects',
        'Advanced analytics and reporting',
        'Priority email & chat support',
        '100GB storage',
        'Enhanced security features',
        'Team collaboration tools',
        'API access'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Complete solution for large organizations',
      icon: Crown,
      color: 'from-purple-500 to-pink-500',
      prices: {
        monthly: 399,
        annual: 359,
        lifetime: 4999
      },
      features: [
        'Access to all 6 application categories',
        'Unlimited projects',
        'Real-time analytics and reporting',
        '24/7 phone & chat support',
        '1TB storage',
        'Enterprise-grade security',
        'Advanced team management',
        'Full API access',
        'Custom integrations',
        'Dedicated account manager',
        'On-premise deployment option'
      ],
      popular: false
    }
  ];

  const handleSelectPlan = (plan) => {
    const selectedPrice = plan.prices[billingCycle];
    if (!selectedPrice) {
      toast({
        title: "Plan Not Available",
        description: "This billing option is not available for the selected plan.",
        variant: "destructive",
        duration: 4000,
      });
      return;
    }

    navigate('/payment', {
      state: {
        plan: {
          ...plan,
          selectedPrice,
          billingCycle
        }
      }
    });
  };

  const calculateSavings = (monthly, annual) => {
    const monthlyCost = monthly * 12;
    const savings = monthlyCost - annual * 12;
    const percentage = Math.round((savings / monthlyCost) * 100);
    return { amount: savings, percentage };
  };

  return (
    <>
      <Helmet>
        <title>Pricing - Petrolord Suite</title>
        <meta name="description" content="Choose the perfect plan for your oil & gas operations. Flexible pricing for teams of all sizes." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-lime-900">
        {/* Header */}
        <div className="container mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Link to="/" className="inline-flex justify-center mb-6 hover:opacity-80 transition-opacity">
              <img 
                src="https://storage.googleapis.com/hostinger-horizons-assets-prod/43fa5c4b-d185-4d6d-9ff4-a1d78861fb87/85e34dd4cd51b193045712640dd8acd3.png" 
                alt="Petrolord Brand Icon" 
                className="w-16 h-16 object-contain"
              />
            </Link>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-lime-100 to-orange-100 bg-clip-text text-transparent mb-6">
              Choose Your Plan
            </h1>
            <p className="text-xl text-lime-200 max-w-3xl mx-auto">
              Unlock the full potential of your oil & gas operations with our comprehensive suite of applications
            </p>
          </motion.div>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex justify-center mb-12"
          >
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-2 flex">
              {['monthly', 'annual', 'lifetime'].map((cycle) => (
                <button
                  key={cycle}
                  onClick={() => setBillingCycle(cycle)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    billingCycle === cycle
                      ? 'bg-gradient-to-r from-lime-600 to-orange-600 text-white shadow-lg'
                      : 'text-lime-200 hover:text-white'
                  }`}
                >
                  {cycle === 'monthly' && 'Monthly'}
                  {cycle === 'annual' && (
                    <span className="flex items-center">
                      Annual
                      <span className="ml-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        Save 10%
                      </span>
                    </span>
                  )}
                  {cycle === 'lifetime' && (
                    <span className="flex items-center">
                      Lifetime
                      <span className="ml-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                        Best Value
                      </span>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              const price = plan.prices[billingCycle];
              const savings = billingCycle === 'annual' && plan.prices.monthly 
                ? calculateSavings(plan.prices.monthly, plan.prices.annual)
                : null;

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className={`relative ${plan.popular ? 'scale-105' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className={`bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 h-full ${
                    plan.popular ? 'border-orange-500/50 shadow-2xl' : ''
                  }`}>
                    <div className="text-center mb-8">
                      <div className={`bg-gradient-to-r ${plan.color} p-4 rounded-xl w-fit mx-auto mb-4`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                      <p className="text-lime-200 text-sm">{plan.description}</p>
                    </div>

                    <div className="text-center mb-8">
                      {price ? (
                        <>
                          <div className="flex items-baseline justify-center mb-2">
                            <span className="text-4xl font-bold text-white">${price}</span>
                            <span className="text-lime-200 ml-2">
                              {billingCycle === 'lifetime' ? 'one-time' : `/${billingCycle === 'monthly' ? 'month' : 'month'}`}
                            </span>
                          </div>
                          {billingCycle === 'annual' && (
                            <p className="text-sm text-lime-300">
                              Billed annually (${price * 12}/year)
                            </p>
                          )}
                          {savings && (
                            <p className="text-sm text-green-400 font-semibold">
                              Save ${savings.amount}/year ({savings.percentage}% off)
                            </p>
                          )}
                        </>
                      ) : (
                        <div className="text-lime-200">
                          <p className="text-lg">Contact Sales</p>
                          <p className="text-sm">Custom pricing available</p>
                        </div>
                      )}
                    </div>

                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <Check className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-lime-100 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => handleSelectPlan(plan)}
                      disabled={!price}
                      className={`w-full py-3 font-semibold text-lg ${
                        plan.popular
                          ? 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700'
                          : `bg-gradient-to-r ${plan.color} hover:shadow-lg`
                      } transition-all duration-300`}
                    >
                      {price ? 'Get Started' : 'Contact Sales'}
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Features Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-20 text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-8">All Plans Include</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  title: 'Industry-Leading Tools',
                  description: 'Access to cutting-edge oil & gas applications built by industry experts'
                },
                {
                  title: 'Cloud-Based Platform',
                  description: 'Secure, scalable infrastructure with 99.9% uptime guarantee'
                },
                {
                  title: 'Regular Updates',
                  description: 'Continuous feature updates and improvements at no extra cost'
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white/5 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-lime-200">{feature.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-20 text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-8">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto space-y-6">
              {[
                {
                  question: 'Can I change my plan later?',
                  answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.'
                },
                {
                  question: 'Is there a free trial?',
                  answer: 'We offer a 14-day free trial for all plans so you can explore our features risk-free.'
                },
                {
                  question: 'What payment methods do you accept?',
                  answer: 'We accept all major credit cards, PayPal, and bank transfers for annual plans.'
                }
              ].map((faq, index) => (
                <div key={index} className="bg-white/5 rounded-xl p-6 text-left">
                  <h3 className="text-lg font-semibold text-white mb-2">{faq.question}</h3>
                  <p className="text-lime-200">{faq.answer}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Pricing;