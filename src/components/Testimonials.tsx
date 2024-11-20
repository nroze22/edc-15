import React from 'react';
import { Quote } from 'lucide-react';

export default function Testimonials() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Trusted by Research Teams Worldwide
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            See how Talosix EDC is transforming clinical research for organizations like yours
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm leading-6 text-gray-900 sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative rounded-2xl bg-white p-6 shadow-xl shadow-gray-900/10 transition-transform hover:-translate-y-1"
            >
              <Quote className="h-12 w-12 text-indigo-600 mb-6 opacity-20" />
              <figure className="relative">
                <blockquote className="text-gray-900">
                  <p>{`"${testimonial.quote}"`}</p>
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-x-4">
                  <img
                    className="h-10 w-10 rounded-full bg-gray-50"
                    src={testimonial.image}
                    alt=""
                  />
                  <div>
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-gray-600">{testimonial.role}</div>
                  </div>
                </figcaption>
              </figure>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const testimonials = [
  {
    quote: "Talosix EDC has revolutionized our clinical trial management. The AI-powered protocol analysis alone has cut our study build time by 65%.",
    author: "Dr. Sarah Chen",
    role: "Clinical Research Director, BioPharma CRO",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    quote: "Finally, an EDC system that understands the needs of mid-size CROs. The platform's flexibility and ease of use are unmatched.",
    author: "Michael Thompson",
    role: "CEO, Clinical Research Solutions",
    image: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    quote: "The automated compliance checks and real-time monitoring have transformed how we manage our multi-site studies.",
    author: "Dr. Emily Rodriguez",
    role: "Principal Investigator, Medical Research Institute",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  }
];