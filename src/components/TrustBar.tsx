import React from 'react';

export default function TrustBar() {
  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold uppercase text-gray-500 tracking-wide">
          Trusted by leading research institutions worldwide
        </p>
        <div className="mt-8 grid grid-cols-2 gap-8 md:grid-cols-5 lg:grid-cols-5">
          {[
            'Novartis Research',
            'Mayo Clinical Trials',
            'IQVIA Research',
            'Parexel Studies',
            'PPD Clinical'
          ].map((company) => (
            <div key={company} className="col-span-1 flex justify-center md:col-span-1">
              <span className="text-lg font-semibold text-gray-400 hover:text-gray-600 transition-colors">
                {company}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-16 flex justify-center">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:grid-cols-3">
            {[
              { stat: '500+', label: 'Clinical Trials' },
              { stat: '50,000+', label: 'Participants' },
              { stat: '99.9%', label: 'Uptime' }
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-4xl font-bold text-indigo-600">{item.stat}</p>
                <p className="mt-2 text-sm font-semibold text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}