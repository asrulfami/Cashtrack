import { z } from "zod";

export const assetCreateSchema = z.object({
  name: z.string().min(1),
  acquisitionValue: z.number(),
  acquisitionDate: z.string().min(1),
  depreciation: z.number().optional(),
  status: z.enum(["active", "inactive", "disposed"]),
});

export const assetUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  acquisitionValue: z.number().optional(),
  acquisitionDate: z.string().min(1).optional(),
  depreciation: z.number().optional(),
  status: z.enum(["active", "inactive", "disposed"]).optional(),
});

export type AssetCreateInput = z.infer<typeof assetCreateSchema>;
export type AssetUpdateInput = z.infer<typeof assetUpdateSchema>;
