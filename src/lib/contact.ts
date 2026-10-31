// Shared contact-form schema — used by the form (client) and /api/contact (server).
import { z } from "zod";

export const CONTACT_LIMITS = { name: 100, email: 254, message: 5000 } as const;

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(CONTACT_LIMITS.name, "Name is too long"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address")
    .max(CONTACT_LIMITS.email, "Email is too long"),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(CONTACT_LIMITS.message, `Message must be at most ${CONTACT_LIMITS.message} characters`),
  // Honeypot: hidden from humans. Bots that auto-fill every field reveal themselves.
  website: z.string().max(200).optional(),
});

export type ContactInput = z.input<typeof contactSchema>;
