import { ZodSchema, type z } from 'zod';

export type ValidationErrors<T> = Partial<Record<keyof T, string>>;

export function validateForm<T>(
  schema: ZodSchema<T>,
  formData: Record<string, any>
): { valid: boolean; errors: ValidationErrors<T>; data?: T } {
  const result = schema.safeParse(formData);

  if (result.success) {
    return { valid: true, errors: {}, data: result.data };
  }

  const errors: ValidationErrors<T> = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof T;
    if (!errors[key]) {
      errors[key] = issue.message;
    }
  }

  return { valid: false, errors };
}

export function validateField<T>(
  schema: ZodSchema<T>,
  field: keyof T,
  value: any
): string | undefined {
  const data = { [field]: value } as Record<string, any>;
  const result = schema.safeParse(data);

  if (result.success) return undefined;

  const issue = result.error.issues.find((i) => i.path[0] === field);
  return issue?.message;
}
