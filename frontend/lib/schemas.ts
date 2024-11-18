import { z } from "zod";

export const SignInFormSchema = z.object({
  username: z.string().min(2, { message: "Username must be at least 2 characters.", }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters.", })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: "Password must contain at least one special character." }),
});

export const SignUpFormSchema = z.object({
  email: z.string().min(2, { message: "Email must be at least 2 characters.", }),
  username: z.string().min(2, { message: "Username must be at least 2 characters.", }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters.", })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: "Password must contain at least one special character." }),
  confirmpassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters.", })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: "Password must contain at least one special character." })
}).superRefine(({ confirmpassword, password }, ctx) => {
  if (confirmpassword !== password) {
    ctx.addIssue({
      code: "custom",
      message: "The passwords did not match",
      path: ['confirmPassword']
    });
  }
});
