import { z } from "zod";

export const transactionCreateSchema = z.object({
  date: z.string().min(1),
  description: z.string().min(1),
  amount: z.number(),
  type: z.enum(["income", "expense"]),
  categoryId: z.string().optional(),
  paymentMethod: z.string().optional(),
});

export const transactionUpdateSchema = z.object({
  date: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  amount: z.number().optional(),
  type: z.enum(["income", "expense"]).optional(),
  categoryId: z.string().optional(),
  paymentMethod: z.string().optional(),
});

export type TransactionCreateInput = z.infer<typeof transactionCreateSchema>;
export type TransactionUpdateInput = z.infer<typeof transactionUpdateSchema>;
