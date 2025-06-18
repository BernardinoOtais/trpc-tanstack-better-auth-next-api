import { z } from "zod";

const PasswordValidaSchema = z
  .string()
  .min(8, { message: "Deve ter pelo menos 8 caracteres." })
  .regex(/[a-zA-Z]/, {
    message: "Deve conter pelo menos uma letra.",
  })
  .trim();
const chave = z
  .string()
  .max(50, { message: "Não pode ter mais de 50 caracteres." })
  .min(23, { message: "Não pode ter menos de 23 caracteres." });

export const PapeisSchema = z.object({
  papeis: z.array(
    z.object({
      idPapel: chave,
      descricao: z.string(),
    })
  ),
});

export const CriaUserComValidacaoPasswordSchema = z
  .object({
    nomeUser: z
      .string()
      .min(4, { message: "Deve ter pelo menos 4 caracteres." })
      .max(50, { message: "Não pode ter mais de 50 caracteres." }),
    nome: z
      .string()
      .min(4, { message: "Deve ter pelo menos 4 caracteres." })
      .max(50, { message: "Não pode ter mais de 50 caracteres." }),
    apelido: z
      .string()
      .min(4, { message: "Deve ter pelo menos 4 caracteres." })
      .max(50, { message: "Não pode ter mais de 50 caracteres." }),
    email: z.string().email(),
    password: PasswordValidaSchema,
    confirmPassword: PasswordValidaSchema,
    message: z.string().optional(),
    papeis: z.array(chave).min(1, { message: "Deve ter pelo menos um papel." }),
  })
  .superRefine((val, ctx) => {
    if (val.password !== val.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "As Passwords não são iguais.",
        path: ["confirmPassword"],
      });
    }
  });

export const LoginSchema = z.object({
  nomeUser: z.string().min(1, { message: "Username é obrigatório." }),
  password: z.string().min(1, { message: "A password é obrigatória." }),
  message: z.string().optional(),
});

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  apelido: z.string(),
  email: z.string().email(),
  accessToken: z.string(),
  refreshToken: z.string(),
  papeis: z.array(z.string()),
});

export const RefreshTokenSchema = z.object({
  refresh: z.string(),
});

export const UserCriadoSchema = z.object({
  nomeUser: z.string(),
  nome: z.string(),
  apelido: z.string(),
  email: z.string().email(),
  message: z.string().optional(),
});

export const UserMiddlewareSchema = z.object({
  sub: z.string(),
  papeis: z.array(z.string()),
  iat: z.number(),
  exp: z.number(),
});

export type CriaUserComValidacaoPasswordDto = z.infer<
  typeof CriaUserComValidacaoPasswordSchema
>;

export type RefreshTokenDto = z.infer<typeof RefreshTokenSchema>;

export type LoginDto = z.infer<typeof LoginSchema>;

export type UserDto = z.infer<typeof UserSchema>;

export type UserCriadoDto = z.infer<typeof UserCriadoSchema>;

export type PapeisDto = z.infer<typeof PapeisSchema>;
