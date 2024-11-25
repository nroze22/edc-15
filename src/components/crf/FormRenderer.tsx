import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { CRFForm } from '../../store/crfStore';
import { cn } from '../../lib/utils';

interface FormRendererProps {
  form: CRFForm;
  onSubmit?: (data: any) => void;
  isPreview?: boolean;
}

export default function FormRenderer({ form, onSubmit, isPreview = false }: FormRendererProps) {
  // Dynamically build the validation schema based on form fields
  const validationSchema = z.object(
    form.sections.reduce((acc, section) => {
      section.fields.forEach((field) => {
        let fieldSchema: any = z.string();

        if (field.required) {
          fieldSchema = fieldSchema.min(1, { message: 'This field is required' });
        } else {
          fieldSchema = fieldSchema.optional();
        }

        if (field.type === 'number') {
          fieldSchema = z.number({
            required_error: 'This field is required',
            invalid_type_error: 'Must be a number',
          });

          if (field.min !== undefined) {
            fieldSchema = fieldSchema.min(field.min, {
              message: `Must be at least ${field.min}`,
            });
          }

          if (field.max !== undefined) {
            fieldSchema = fieldSchema.max(field.max, {
              message: `Must be at most ${field.max}`,
            });
          }
        }

        if (field.type === 'date') {
          fieldSchema = z.date({
            required_error: 'This field is required',
            invalid_type_error: 'Must be a date',
          });
        }

        acc[field.id] = fieldSchema;
      });
      return acc;
    }, {} as any)
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validationSchema),
  });

  const handleFormSubmit = (data: any) => {
    if (onSubmit && !isPreview) {
      onSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {form.sections.map((section) => (
        <div
          key={section.id}
          className="space-y-4 rounded-lg border p-6 bg-card text-card-foreground shadow-sm"
        >
          <div className="space-y-2">
            <h3 className="text-xl font-semibold tracking-tight">
              {section.title}
            </h3>
            {section.description && (
              <p className="text-sm text-muted-foreground">{section.description}</p>
            )}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {section.fields.map((field) => {
              const fieldError = errors[field.id]?.message as string;

              return (
                <div key={field.id} className="space-y-2">
                  <Label
                    htmlFor={field.id}
                    className="flex text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {field.label}
                    {field.required && (
                      <span className="text-destructive ml-1">*</span>
                    )}
                  </Label>

                  {field.description && (
                    <p className="text-[0.8rem] text-muted-foreground">
                      {field.description}
                    </p>
                  )}

                  {/* Text, Number, and Textarea fields */}
                  {['text', 'number', 'textarea'].includes(field.type) && (
                    <Input
                      {...register(field.id)}
                      type={field.type === 'number' ? 'number' : 'text'}
                      id={field.id}
                      placeholder={field.placeholder}
                      className={cn(
                        fieldError && 'border-destructive',
                        field.type === 'textarea' && 'min-h-[100px]'
                      )}
                    />
                  )}

                  {/* Date field */}
                  {field.type === 'date' && (
                    <Controller
                      control={control}
                      name={field.id}
                      render={({ field: { onChange, value } }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full justify-start text-left font-normal',
                                !value && 'text-muted-foreground',
                                fieldError && 'border-destructive'
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {value ? format(value, 'PPP') : 'Pick a date'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={value}
                              onSelect={onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                  )}

                  {/* Select and Radio fields */}
                  {['select', 'radio'].includes(field.type) && field.options && (
                    <Controller
                      control={control}
                      name={field.id}
                      render={({ field: { onChange, value } }) => (
                        <Select onValueChange={onChange} value={value}>
                          <SelectTrigger
                            className={cn(fieldError && 'border-destructive')}
                          >
                            <SelectValue
                              placeholder={field.placeholder || 'Select an option'}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  )}

                  {fieldError && (
                    <p className="text-sm font-medium text-destructive">
                      {fieldError}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {!isPreview && (
        <Button type="submit" className="w-full sm:w-auto">
          Submit
        </Button>
      )}
    </form>
  );
}
