import { z } from "zod";

export const COMPLAINT_ATTRIBUTE = "COMPLAINT";
export type ComplaintModel = z.infer<typeof ComplaintModelSchema>;

export const ComplaintModelSchema = z.object({
  id: z.string(),
  userId: z.string(),
  causeTechnique: z
    .string()
    .min(1, "Cause technique est requis."),
  actionCorrective: z
    .string()
    .min(1, "Action corrective est requis."),
  actionClient: z
    .string()
    .optional(),
  createdAt: z.date(),
});
