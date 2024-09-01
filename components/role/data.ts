import { relationSingleZodObject } from '@/types';
import { z } from 'zod';

export const roleSchema = z.object({
  name: z.string().trim().min(1, { message: 'Role name is required' }),
  description: z.string().optional(),
  root: z.boolean().optional(),

  $add: z.record(z.string(), z.array(relationSingleZodObject)).optional(),
  $clear: z.record(z.string(), z.array(relationSingleZodObject)).optional()
});

export type RoleFormValues = z.infer<typeof roleSchema>;

export const defaultRoleFormValues: RoleFormValues = {
  name: '',
  description: '',
  root: false,

  $add: {},
  $clear: {}
};
