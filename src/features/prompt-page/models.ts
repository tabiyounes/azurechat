import { refineFromEmpty } from "@/features/common/schema-validation";
import { z } from "zod";

export const PROMPT_ATTRIBUTE = "PROMPT";
export type PromptModel = z.infer<typeof PromptModelSchema>;

export const PromptModelSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(1, {
      message: "Le titre ne peut pas être vide",
    })
    .refine(refineFromEmpty, "Le titre ne peut pas être vide"),
  description: z
    .string()
    .min(1, {
      message: "La description ne peut pas être vide",
    })
    .refine(refineFromEmpty, "La description ne peut pas être vide"),
  createdAt: z.date(),
  isPublished: z.boolean(),
  userId: z.string(),
  type: z.literal(PROMPT_ATTRIBUTE),
});
