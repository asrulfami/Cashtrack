import { z } from "zod";

export const investmentCreateSchema = z.object({
  name: z.string().min(1),
  kind: z.enum(["stock", "bond", "deposit", "mutual_fund", "other"]),
  buyDate: z.string().min(1),
  units: z.number(),
  buyPrice: z.number(),
  currentPrice: z.number(),
});

export const investmentUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  kind: z.enum(["stock", "bond", "deposit", "mutual_fund", "other"]).optional(),
  buyDate: z.string().min(1).optional(),
  units: z.number().optional(),
  buyPrice: z.number().optional(),
  currentPrice: z.number().optional(),
});

export type InvestmentCreateInput = z.infer<typeof investmentCreateSchema>;
export type InvestmentUpdateInput = z.infer<typeof investmentUpdateSchema>;
