import React from 'react';
import { Check, ArrowRight } from 'lucide-react';

interface PricingProps {
  onAuth?: () => void;
}

export default function Pricing({ onAuth }: PricingProps) {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Pricing that scales with your research
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
          Choose the perfect plan for your research needs. All plans include our core EDC features and AI capabilities.
        </p>
        
        <div className="mt-16 grid max-w-lg grid-cols-1 gap-y-6 sm:mt-20 sm:grid-cols-2 sm:gap-y-0 sm:gap-x-8 lg:max-w-4xl lg:grid-cols-2 xl:mx-auto">
          {[
            {
              name: 'Growth',
              id: 'growth',
              price: '999',
              description: 'Perfect for small to medium CROs running multiple studies.',
              features: [
                'Up to 5 concurrent studies',
                'Unlimited sites and users',
                'AI protocol analysis',
                'Standard eCRF templates',
                'Email & phone support',
                'Basic analytics',
                'HIPAA & 21 CFR Part 11 compliance'
              ],
              cta: 'Start free trial',
              mostPopular: false,
            },
            {
              name: 'Enterprise',
              id: 'enterprise',
              price: '2499',
              description: 'Advanced features for larger organizations with complex needs.',
              features: [
                'Unlimited concurrent studies',
                'Advanced AI capabilities',
                'Custom eCRF builder',
                'Advanced analytics & reporting',
                'Dedicated success manager',
                'Custom integrations',
                'Training & onboarding',
                'SLA guarantees'
              ],
              cta: 'Contact sales',
              mostPopular: true,
            },
          ].map((tier) => (
            <div
              key={tier.id}
              className={`flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10 ${
                tier.mostPopular ? 'ring-2 ring-indigo-600' : ''
              }`}
            >
              <div>
                {tier.mostPopular && (
                  <div className="mb-4">
                    <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-600 ring-1 ring-inset ring-indigo-600/20">
                      Most popular
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between gap-x-4">
                  <h3 className="text-lg font-semibold leading-8 text-gray-900">{tier.name}</h3>
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-600">{tier.description}</p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">${tier.price}</span>
                  <span className="text-sm font-semibold leading-6 text-gray-600">/month</span>
                </p>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <Check className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={onAuth}
                className={`mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  tier.mostPopular
                    ? 'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600'
                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                }`}
              >
                {tier.cta}
                <ArrowRight className="ml-2 h-4 w-4 inline" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}