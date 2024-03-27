import z from "zod";

export const userFormSchema = z.object({
  name: z.string().min(5, {
    message: "Name must be at least 5 characters.",
  }),
  email: z.string().email(),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  mobile: z
    .string()
    .min(10, {
      message: "Mobile must be at least 10 digits.",
    })
    .transform((v) => Number(v) || 0),
  
});

export const providerFormSchema = z.object({
  name: z.string().min(5, {
    message: "Name must be at least 5 characters.",
  }),
  email: z.string().email(),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  serviceName: z.string(),
  offlinePrice: z.string().transform((v) => Number(v) || 0),
  onlinePrice: z.string().transform((v) => Number(v) || 0),
  mobile: z
    .string()
    .min(10, {
      message: "Mobile must be at least 10 digits.",
    })
    .transform((v) => Number(v) || 0),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});
