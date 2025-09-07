import { z } from 'zod'

// ✅ CREATE
export const CreateActionDto = z
  .object({
    appId: z.int().positive().optional(),
    code: z.string().min(1, { message: 'Code is required' }).max(10),
    description: z.string().optional()
  })
  .strict()

export type CreateActionDtoType = z.infer<typeof CreateActionDto>

// ✅ UPDATE
export const UpdateActionDto = z
  .object({
    code: z.string().min(1).max(10).optional(),
    description: z.string().optional()
  })
  .strict()

export type UpdateActionDtoType = z.infer<typeof UpdateActionDto>

// ✅ DELETE (soft or hard delete flag)
export const DeleteActionDto = z
  .object({
    hard: z.boolean().optional()
  })
  .strict()
  .optional()

export type DeleteActionDtoType = z.infer<typeof DeleteActionDto>
