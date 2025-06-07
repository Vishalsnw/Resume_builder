// pages/help/contact.tsx

import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  FiMail, 
  FiMessageSquare, 
  FiPhone, 
  FiClock,
  FiAlertCircle,
  FiCheckCircle 
} from 'react-icons/fi';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { Textarea } from '@/components/Textarea';
import { prisma } from '@/lib/prisma';

// Form validation schema
const contactSchema = z.object({
  category: z.string().min(1, 'Please select a category'),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(100),
  description: z.string().min(20, 'Description must be at least 20 characters').max(2000),
  priority: z.enum(['low', 'medium', 'high']),
  preferredContact: z.enum(['email', 'phone']),
  phone: z.string().optional().refine((val) => {
    if (!val) return true;
    return /^\+?[\d\s-]{10,}$/.test(val);
  }, 'Please enter a valid phone number'),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactPageProps {
  categories: {
    id: string;
    name: string;
    description: string;
  }[];
  supportHours: {
    timezone: string;
    hours: string;
    days: string;
  };
  averageResponseTime: string;
}

export default function ContactPage({ 
  categories, 
  supportHours,
  averageResponseTime 
}: ContactPageProps) {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors },
    reset 
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      preferredContact: 'email',
      priority: 'medium',
    },
  });

  const preferredContact = watch('preferredContact');

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/help/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          userId: session?.user?.id,
          email: session?.user?.email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit support request');
      }

      setSubmitSuccess(true);
      reset();

      // Log activity
      await fetch('/api/activity-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'SUPPORT_REQUEST',
          description: `Submitted support request: ${data.subject}`,
          createdBy: 'Vishalsnw',
          timestamp: '2025-06-07 21:13:01',
        }),
      });

    } catch (error) {
      console.error('Contact form submission error:', error);
      setSubmitError('Failed to submit your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Contact Support - Resume Builder</title>
        <meta name="description" content="Contact our support team for help with Resume Builder" />
      </Head>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Contact Support
          </h1>
          <p className="text-lg text-gray-600">
            Need help? Our support team is here to assist you.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Support Information */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Support Hours
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <FiClock className="w-5 h-5 text-blue-600 mt-1 mr-3" />
                  <div>
                    <p className="font-medium">{supportHours.hours}</p>
                    <p className="text-sm text-gray-500">{supportHours.days}</p>
                    <p className="text-sm text-gray-500">{supportHours.timezone}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FiMessageSquare className="w-5 h-5 text-blue-600 mt-1 mr-3" />
                  <div>
                    <p className="font-medium">Average Response Time</p>
                    <p className="text-sm text-gray-500">{averageResponseTime}</p>
                  </div>
                </div>

                {session?.user?.email && (
                  <div className="flex items-start">
                    <FiMail className="w-5 h-5 text-blue-600 mt-1 mr-3" />
                    <div>
                      <p className="font-medium">Your Email</p>
                      <p className="text-sm text-gray-500">{session.user.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Select
                label="Category"
                error={errors.category?.message}
                {...register('category')}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>

              <Input
                label="Subject"
                error={errors.subject?.message}
                {...register('subject')}
              />

              <Textarea
                label="Description"
                error={errors.description?.message}
                {...register('description')}
                rows={5}
                placeholder="Please describe your issue in detail..."
              />

              <Select
                label="Priority"
                error={errors.priority?.message}
                {...register('priority')}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Select>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Preferred Contact Method
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="email"
                      {...register('preferredContact')}
                      className="mr-2"
                    />
                    Email
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="phone"
                      {...register('preferredContact')}
                      className="mr-2"
                    />
                    Phone
                  </label>
                </div>
              </div>

              {preferredContact === 'phone' && (
                <Input
                  label="Phone Number"
                  type="tel"
                  error={errors.phone?.message}
                  {...register('phone')}
                  placeholder="+1 (555) 123-4567"
                />
              )}

              {submitError && (
                <div className="flex items-center text-red-600">
                  <FiAlertCircle className="w-5 h-5 mr-2" />
                  {submitError}
                </div>
              )}

              {submitSuccess && (
                <div className="flex items-center text-green-600">
                  <FiCheckCircle className="w-5 h-5 mr-2" />
                  Your support request has been submitted successfully.
                </div>
              )}

              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={isSubmitting}
                className="w-full"
              >
                Submit Request
              </Button>
            </form>
          </div>
        </div>

        {/* Last updated timestamp */}
        <div className="text-center text-sm text-gray-500 mt-12">
          Last updated by Vishalsnw at 2025-06-07 21:13:01
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  // Fetch support categories
  const categories = await prisma.supportCategory.findMany({
    select: {
      id: true,
      name: true,
      description: true,
    },
    where: {
      isActive: true,
    },
  });

  // Get support hours configuration
  const supportConfig = await prisma.systemConfig.findFirst({
    where: {
      key: 'support_hours',
    },
  });

  // Get average response time
  const averageResponseTime = await prisma.supportTicket.aggregate({
    _avg: {
      firstResponseTime: true,
    },
    where: {
      createdAt: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
      },
    },
  });

  return {
    props: {
      categories,
      supportHours: {
        timezone: 'UTC',
        hours: '9:00 AM - 6:00 PM',
        days: 'Monday - Friday',
      },
      averageResponseTime: '~4 hours',
    },
  };
};
