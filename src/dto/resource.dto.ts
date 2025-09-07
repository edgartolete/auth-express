import { z } from 'zod'

// ✅ CREATE
export const CreateResourceDto = z
  .object({
    groupId: z.number().int().positive().optional(),
    name: z.string().min(1, { message: 'Name is required' }).max(50),
    description: z.string().optional()
  })
  .strict()

export type CreateResourceDtoType = z.infer<typeof CreateResourceDto>

// ✅ UPDATE
export const UpdateResourceDto = z
  .object({
    groupId: z.number().int().positive().optional(),
    name: z.string().min(1).max(50).optional(),
    description: z.string().optional()
  })
  .strict()

export type UpdateResourceDtoType = z.infer<typeof UpdateResourceDto>

// ✅ DELETE
export const DeleteResourceDto = z
  .object({
    hard: z.boolean().optional()
  })
  .strict()
  .optional()

export type DeleteResourceDtoType = z.infer<typeof DeleteResourceDto>
