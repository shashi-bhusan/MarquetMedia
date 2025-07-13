'use client';

import React, { useState } from 'react';
import { Dialog, Input, Textarea } from './dialog';
import { ProfessionalButton } from './professional-button';
import { Send, Check } from 'lucide-react';

interface ContactFormData {
  name: string;
  email: string;
  businessName: string;
  lookingFor: string;
}

interface ContactFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  businessName?: string;
  lookingFor?: string;
}

export function ContactFormDialog({ isOpen, onClose }: ContactFormDialogProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    businessName: '',
    lookingFor: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }

    if (!formData.lookingFor.trim()) {
      newErrors.lookingFor = 'Please tell us what you\'re looking for';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Here you would typically send the data to your backend
      // For now, we'll simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Form submitted:', formData);
      
      setIsSubmitted(true);
      
      // Auto-close after success
      setTimeout(() => {
        handleClose();
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      // You could set a global error state here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset form state when closing
    setFormData({
      name: '',
      email: '',
      businessName: '',
      lookingFor: ''
    });
    setErrors({});
    setIsSubmitting(false);
    setIsSubmitted(false);
    onClose();
  };

  if (isSubmitted) {
    return (
      <Dialog
        isOpen={isOpen}
        onClose={handleClose}
        title="Thank You!"
        description="We've received your message and will get back to you soon."
        className="max-w-md"
      >
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-foreground/70 mb-6">
            We'll review your request and reach out within 24 hours to discuss how we can help elevate your brand.
          </p>
        </div>
      </Dialog>
    );
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title="Let's Create Something Amazing"
      description="Tell us about your project and we'll craft a strategy that resonates with your audience."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Your Name"
          type="text"
          placeholder="John Doe"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          error={errors.name}
          disabled={isSubmitting}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          error={errors.email}
          disabled={isSubmitting}
        />

        <Input
          label="Brand / Business Name"
          type="text"
          placeholder="Your Company Name"
          value={formData.businessName}
          onChange={(e) => handleInputChange('businessName', e.target.value)}
          error={errors.businessName}
          disabled={isSubmitting}
        />

        <Textarea
          label="What are you looking for?"
          placeholder="Tell us about your project, goals, or challenges. The more details you share, the better we can tailor our approach to your needs."
          value={formData.lookingFor}
          onChange={(e) => handleInputChange('lookingFor', e.target.value)}
          error={errors.lookingFor}
          disabled={isSubmitting}
        />

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 border border-foreground/20 rounded-full text-foreground hover:bg-foreground/5 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          
          <ProfessionalButton
            type="submit"
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2"
            variant="professional"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Message
              </>
            )}
          </ProfessionalButton>
        </div>
      </form>
    </Dialog>
  );
}
