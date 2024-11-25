import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form';
import { Input } from '../../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { Button } from '../../ui/button';
import { Calendar } from '../../ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../ui/popover';
import { cn } from '../../../lib/utils';
import { CalendarIcon } from 'lucide-react';
import { useToast } from '../../ui/use-toast';

const demographicsSchema = z.object({
  participantId: z.string()
    .min(1, 'Participant ID is required')
    .regex(/^[A-Za-z0-9-]+$/, 'Only letters, numbers, and hyphens are allowed'),
  dateOfBirth: z.date({
    required_error: "Date of birth is required",
  }),
  age: z.number()
    .min(0, 'Age must be positive')
    .max(120, 'Age must be less than 120'),
  sex: z.enum(['male', 'female', 'other', 'prefer_not_to_say'], {
    required_error: "Sex is required",
  }),
  gender: z.enum(['male', 'female', 'non_binary', 'other', 'prefer_not_to_say'], {
    required_error: "Gender is required",
  }),
  ethnicity: z.enum(['hispanic_latino', 'not_hispanic_latino', 'unknown', 'prefer_not_to_say'], {
    required_error: "Ethnicity is required",
  }),
  race: z.enum([
    'american_indian',
    'asian',
    'black',
    'pacific_islander',
    'white',
    'other',
    'prefer_not_to_say'
  ], {
    required_error: "Race is required",
  }),
  primaryLanguage: z.string().min(1, 'Primary language is required'),
  height: z.number()
    .min(0, 'Height must be positive')
    .max(300, 'Height must be less than 300 cm'),
  weight: z.number()
    .min(0, 'Weight must be positive')
    .max(500, 'Weight must be less than 500 kg'),
});

type DemographicsFormData = z.infer<typeof demographicsSchema>;

interface DemographicsFormProps {
  onSubmit?: (data: DemographicsFormData) => void;
  initialData?: Partial<DemographicsFormData>;
  readOnly?: boolean;
}

export default function DemographicsForm({
  onSubmit,
  initialData,
  readOnly = false,
}: DemographicsFormProps) {
  const { toast } = useToast();
  const form = useForm<DemographicsFormData>({
    resolver: zodResolver(demographicsSchema),
    defaultValues: {
      participantId: initialData?.participantId || '',
      dateOfBirth: initialData?.dateOfBirth || undefined,
      age: initialData?.age || undefined,
      sex: initialData?.sex || undefined,
      gender: initialData?.gender || undefined,
      ethnicity: initialData?.ethnicity || undefined,
      race: initialData?.race || undefined,
      primaryLanguage: initialData?.primaryLanguage || '',
      height: initialData?.height || undefined,
      weight: initialData?.weight || undefined,
    },
  });

  const handleSubmit = async (data: DemographicsFormData) => {
    try {
      if (onSubmit) {
        await onSubmit(data);
      }
      toast({
        title: "Success",
        description: "Demographics data saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save demographics data",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Demographics</CardTitle>
            <CardDescription>
              Participant demographic information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Participant ID */}
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="participantId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Participant ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter participant ID"
                        {...field}
                        disabled={readOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date of Birth */}
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={readOnly}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={readOnly}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Sex and Gender */}
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="sex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sex at Birth</FormLabel>
                    <Select
                      disabled={readOnly}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select sex at birth" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender Identity</FormLabel>
                    <Select
                      disabled={readOnly}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender identity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="non_binary">Non-binary</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Ethnicity and Race */}
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="ethnicity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ethnicity</FormLabel>
                    <Select
                      disabled={readOnly}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select ethnicity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="hispanic_latino">Hispanic or Latino</SelectItem>
                        <SelectItem value="not_hispanic_latino">Not Hispanic or Latino</SelectItem>
                        <SelectItem value="unknown">Unknown</SelectItem>
                        <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="race"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Race</FormLabel>
                    <Select
                      disabled={readOnly}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select race" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="american_indian">American Indian or Alaska Native</SelectItem>
                        <SelectItem value="asian">Asian</SelectItem>
                        <SelectItem value="black">Black or African American</SelectItem>
                        <SelectItem value="pacific_islander">Native Hawaiian or Pacific Islander</SelectItem>
                        <SelectItem value="white">White</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Height and Weight */}
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height (cm)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter height in cm"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        disabled={readOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter weight in kg"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        disabled={readOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {!readOnly && (
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button type="submit">Save Demographics</Button>
          </div>
        )}
      </form>
    </Form>
  );
}
