import { z } from "zod";

export const enquirySchema = z.object({
  propertyType: z.enum(["HDB", "Condo", "Landed"]),
  categories: z.array(z.string()).min(1, "Pick at least one category"),
  budget: z.string().min(1),
  timeline: z.string().min(1),
  name: z.string().min(1, "Your name is required"),
  contact: z.string().min(5, "A contact number or email is required"),
  message: z.string().optional().default(""),
  vendorSlugs: z.array(z.string()).optional().default([]),
  pdpaConsent: z.literal(true, {
    message: "PDPA consent is required to submit",
  }),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export const checkoutSchema = z.object({
  plan: z.enum(["basic", "silver", "gold"]),
});

export const vendorProfileSchema = z.object({
  name: z.string().min(1),
  whatsapp: z.string().optional().default(""),
  phone: z.string().optional().default(""),
  location: z.string().optional().default(""),
  email: z.string().email().optional().or(z.literal("")),
  about: z.string().optional().default(""),
});

export const registerSchema = z.object({
  role: z.enum(["customer", "vendor"]),
  email: z.string().email(),
  password: z.string().min(8, "Use at least 8 characters"),
  fullName: z.string().min(1),
  businessName: z.string().optional(),
});
