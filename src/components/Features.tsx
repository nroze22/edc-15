import React from 'react';
import {
  Brain,
  Shield,
  FileCheck,
  Users,
  BarChart,
  Zap,
  Clock,
  DollarSign,
  Sparkles,
  LayoutDashboard,
  FileText,
  Workflow
} from 'lucide-react';

const primaryFeatures = [
  {
    name: 'AI-Powered Protocol Analysis',
    description: 'Our AI assistant analyzes your protocol in minutes, suggesting optimizations and automatically generating CRFs. Perfect for CROs running multiple studies with lean teams.',
    icon: Brain,
    color: 'bg-purple-500',
    stats: [
      { label: 'Faster Protocol Review', value: '85%' },
      { label: 'Error Reduction', value: '65%' }
    ]
  },
  {
    name: 'Rapid Study Setup',
    description: 'Launch studies in days, not months. Our template library and AI-powered form builder are specifically designed for Phase I-III trials common in small to mid-size CROs.',
    icon: Zap,
    color: 'bg-blue-500',
    stats: [
      { label: 'Setup Time Reduction', value: '70%' },
      { label: 'Template Reusability', value: '90%' }
    ]
  },
  {
    name: 'Cost-Effective Scaling',
    description: 'Pay only for what you use with our flexible pricing. Perfect for CROs running 5-50 concurrent studies. No hidden fees, no complex licensing – just straightforward per-study pricing.',
    icon: DollarSign,
    color: 'bg-green-500',
    stats: [
      { label: 'Cost Savings', value: '45%' },
      { label: 'ROI Increase', value: '3.5x' }
    ]
  }
];

const secondaryFeatures = [
  {
    name: 'Compliance Built-In',
    description: '21 CFR Part 11 compliant with HIPAA certification and SOC 2 Type II. Enterprise-grade security sized for smaller organizations.',
    icon: Shield,
  },
  {
    name: 'Smart Validation Rules',
    description: 'AI-powered data validation catches errors before they become problems. Reduce query rates by up to 60%.',
    icon: Sparkles,
  },
  {
    name: 'Intuitive Site Portal',
    description: 'Site-friendly interface requires minimal training. Get sites up and running in hours, not days.',
    icon: LayoutDashboard,
  },
  {
    name: 'Automated EDC Build',
    description: 'AI extracts data points from your protocol and suggests optimal CRF designs based on industry standards.',
    icon: FileText,
  },
  {
    name: 'Real-time Collaboration',
    description: 'Built-in workflows for CRAs, data managers, and monitors. Perfect for distributed teams.',
    icon: Users,
  },
  {
    name: 'Streamlined Workflows',
    description: 'Automated query resolution, integrated eSource, and real-time edit checks reduce manual work.',
    icon: Workflow,
  }
];

export default function Features() {
  return (
    <div id="features" className="py-24 bg-white sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Everything You Need</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Enterprise Power, Without Enterprise Complexity
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Purpose-built for small to mid-size CROs, our EDC combines powerful features with
            intuitive design. Get everything you need, nothing you don't.
          </p>
        </div>

        {/* Primary Features */}
        <div className="mx-auto mt-16 max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-3">
            {primaryFeatures.map((feature) => (
              <div
                key={feature.name}
                className="relative overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-gray-900/10"
              >
                <div className="p-6">
                  <div className={`inline-flex rounded-lg ${feature.color} p-3 text-white`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-gray-900">{feature.name}</h3>
                  <p className="mt-2 text-base text-gray-600">{feature.description}</p>
                  
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    {feature.stats.map((stat) => (
                      <div key={stat.label}>
                        <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                        <div className="text-sm text-gray-600">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Secondary Features */}
        <div className="mx-auto mt-16 max-w-7xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {secondaryFeatures.map((feature) => (
              <div
                key={feature.name}
                className="relative overflow-hidden rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/10 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
                    <feature.icon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                  </div>
                  <h3 className="ml-4 text-lg font-medium text-gray-900">{feature.name}</h3>
                </div>
                <p className="mt-3 text-base text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}