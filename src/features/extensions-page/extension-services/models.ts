import { refineFromEmpty } from "@/features/common/schema-validation";
import { z } from "zod";

export const EXTENSION_ATTRIBUTE = "EXTENSION";

export type ExtensionModel = z.infer<typeof ExtensionModelSchema>;
export type ExtensionFunctionModel = z.infer<typeof ExtensionFunctionSchema>;
export type HeaderModel = z.infer<typeof HeaderSchema>;

export const HeaderSchema = z.object({
  id: z.string(),
  key: z
    .string()
    .min(1, {
      message: "La clé d'en-tête ne peut pas être vide",
    })
    .refine(refineFromEmpty, "La clé d'en-tête ne peut pas être vide"),
  value: z
    .string()
    .min(1, {
      message: "La valeur d'en-tête ne peut pas être vide",
    })
    .refine(refineFromEmpty, "La valeur d'en-tête ne peut pas être vide"),
});

export type EndpointType = z.infer<typeof EndpointTypeSchema>;

export const EndpointTypeSchema = z.enum([
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
]);

export const ExtensionFunctionSchema = z.object({
  id: z.string({ required_error: "L'ID de fonction est requis" }),
  code: z
    .string()
    .min(1, {
      message: "Le code de fonction ne peut pas être vide",
    })
    .refine(refineFromEmpty, "Le code de fonction ne peut pas être vide"),
  endpoint: z
    .string()
    .min(1, {
      message: "Le point de terminaison de fonction ne peut pas être vide",
    })
    .refine(refineFromEmpty, "Le point de terminaison de fonction ne peut pas être vide"),
  endpointType: EndpointTypeSchema,
  isOpen: z.boolean(),
});

export const ExtensionModelSchema = z.object({
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
  executionSteps: z
    .string()
    .min(1, {
      message: "Le persona ne peut pas être vide",
    })
    .refine(refineFromEmpty, "La description ne peut pas être vide"),
  headers: z.array(HeaderSchema),
  userId: z.string(),
  isPublished: z.boolean(),
  createdAt: z.date(),
  functions: z.array(ExtensionFunctionSchema), // validation is done in the function schema
  type: z.literal(EXTENSION_ATTRIBUTE),
});