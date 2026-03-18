import { z } from 'zod';

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, { message: 'Логин обязателен для заполнения' })
    .trim()
    .max(50, { message: 'Логин не должен превышать 50 символов' }),
  
  password: z
    .string()
    .min(1, { message: 'Пароль обязателен для заполнения' })
    .min(6, { message: 'Пароль должен содержать не менее 6 символов' })
    .max(100, { message: 'Пароль не должен превышать 100 символов' }),
  
  rememberMe: z.boolean().optional().default(false),
});

export type TLoginFormData = {
    username: string;
    password: string;
    rememberMe?: boolean;
}
// TODO: или лучше так сделать?
// = z.infer<typeof loginSchema>;