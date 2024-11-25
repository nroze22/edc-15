import React from 'react';
import DemographicsForm from '../components/crf/templates/DemographicsForm';
import FormPreview from '../components/crf/FormPreview';

export default function DemographicsPreview() {
  const handleSubmit = (data: any) => {
    console.log('Form submitted:', data);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">Demographics Form Preview</h1>
          <p className="text-muted-foreground">
            Preview the demographics form in different device formats
          </p>
        </div>

        <FormPreview>
          <div className="max-w-4xl mx-auto p-4">
            <DemographicsForm onSubmit={handleSubmit} />
          </div>
        </FormPreview>
      </div>
    </div>
  );
}
