import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Building, CreditCard } from 'lucide-react';

export const PersonalInfoStep = ({ formData, handleInputChange }) => (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <User className="w-12 h-12 text-lime-400 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-white">Personal Information</h2>
      <p className="text-lime-200">Let's start with your basic details</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-white">Full Name *</Label>
        <Input
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          className="bg-white/5 border-white/20 text-white placeholder:text-lime-300/70"
          placeholder="Enter your full name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-white">Email Address *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          className="bg-white/5 border-white/20 text-white placeholder:text-lime-300/70"
          placeholder="Enter your email"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-white">Password *</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          className="bg-white/5 border-white/20 text-white placeholder:text-lime-300/70"
          placeholder="Create a password"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-white">Confirm Password *</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          className="bg-white/5 border-white/20 text-white placeholder:text-lime-300/70"
          placeholder="Confirm your password"
          required
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="phone" className="text-white">Phone Number *</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleInputChange}
          className="bg-white/5 border-white/20 text-white placeholder:text-lime-300/70"
          placeholder="Enter your phone number"
          required
        />
      </div>
    </div>
  </div>
);

export const CompanyInfoStep = ({ formData, handleInputChange }) => (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <Building className="w-12 h-12 text-lime-400 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-white">Company Information</h2>
      <p className="text-lime-200">Tell us about your organization</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="companyName" className="text-white">Company Name *</Label>
        <Input
          id="companyName"
          name="companyName"
          value={formData.companyName}
          onChange={handleInputChange}
          className="bg-white/5 border-white/20 text-white placeholder:text-lime-300/70"
          placeholder="Enter company name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="jobTitle" className="text-white">Job Title *</Label>
        <Input
          id="jobTitle"
          name="jobTitle"
          value={formData.jobTitle}
          onChange={handleInputChange}
          className="bg-white/5 border-white/20 text-white placeholder:text-lime-300/70"
          placeholder="Enter your job title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="companySize" className="text-white">Company Size *</Label>
        <select
          id="companySize"
          name="companySize"
          value={formData.companySize}
          onChange={handleInputChange}
          className="w-full h-10 px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white"
          required
        >
          <option value="">Select company size</option>
          <option value="1-10">1-10 employees</option>
          <option value="11-50">11-50 employees</option>
          <option value="51-200">51-200 employees</option>
          <option value="201-1000">201-1000 employees</option>
          <option value="1000+">1000+ employees</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="country" className="text-white">Country *</Label>
        <Input
          id="country"
          name="country"
          value={formData.country}
          onChange={handleInputChange}
          className="bg-white/5 border-white/20 text-white placeholder:text-lime-300/70"
          placeholder="Enter your country"
          required
        />
      </div>
    </div>
  </div>
);

export const PaymentInfoStep = ({ formData, handleInputChange, plan }) => (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <CreditCard className="w-12 h-12 text-lime-400 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-white">Payment Information</h2>
      <p className="text-lime-200">Secure payment processing</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="cardNumber" className="text-white">Card Number *</Label>
        <Input
          id="cardNumber"
          name="cardNumber"
          value={formData.cardNumber}
          onChange={handleInputChange}
          className="bg-white/5 border-white/20 text-white placeholder:text-lime-300/70"
          placeholder="1234 5678 9012 3456"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="expiryDate" className="text-white">Expiry Date *</Label>
        <Input
          id="expiryDate"
          name="expiryDate"
          value={formData.expiryDate}
          onChange={handleInputChange}
          className="bg-white/5 border-white/20 text-white placeholder:text-lime-300/70"
          placeholder="MM/YY"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cvv" className="text-white">CVV *</Label>
        <Input
          id="cvv"
          name="cvv"
          value={formData.cvv}
          onChange={handleInputChange}
          className="bg-white/5 border-white/20 text-white placeholder:text-lime-300/70"
          placeholder="123"
          required
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="cardholderName" className="text-white">Cardholder Name *</Label>
        <Input
          id="cardholderName"
          name="cardholderName"
          value={formData.cardholderName}
          onChange={handleInputChange}
          className="bg-white/5 border-white/20 text-white placeholder:text-lime-300/70"
          placeholder="Name on card"
          required
        />
      </div>
    </div>

    <div className="bg-white/5 rounded-lg p-6 mt-8">
      <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>
      <div className="space-y-2">
        <div className="flex justify-between text-lime-200">
          <span>{plan.name} Plan ({plan.billingCycle})</span>
          <span>${plan.selectedPrice}</span>
        </div>
        <div className="border-t border-white/10 pt-2">
          <div className="flex justify-between text-white font-semibold">
            <span>Total</span>
            <span>${plan.selectedPrice}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);