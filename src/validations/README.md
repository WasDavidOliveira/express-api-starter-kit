# Validations da API

Esta pasta contém os esquemas de validação utilizados pela aplicação para garantir a integridade e conformidade dos dados de entrada. As validações são implementadas usando a biblioteca Zod, que oferece uma forma tipada e expressiva de validar dados.

## Conceito

Os esquemas de validação definem a estrutura e as regras que os dados de entrada devem seguir antes de serem processados pela aplicação. Eles:

- Garantem que os dados tenham a estrutura correta
- Definem tipos e formatos esperados para cada campo
- Aplicam regras de negócio em nível de dados
- Fornecem mensagens de erro claras e específicas
- Transformam dados de entrada quando necessário

## Estrutura da Pasta

```
validations/
├── index.ts                    # Exporta todas as validações
├── common/                     # Validações comuns reutilizáveis
│   ├── date.validations.ts     # Validações para datas
│   ├── pagination.validations.ts # Validações para paginação
│   └── id.validations.ts       # Validações para IDs
└── [entity]/                   # Subpastas por entidade
    └── [entity].validations.ts # Esquemas de validação específicos
```

## Responsabilidades

Os esquemas de validação são responsáveis por:

- Definir a estrutura esperada dos objetos
- Validar tipos primitivos (string, number, boolean, etc.)
- Aplicar regras de validação (min, max, regex, etc.)
- Transformar dados entre formatos
- Definir mensagens de erro personalizadas
- Implementar validações condicionais
- Reutilizar validações comuns

## Exemplo de Implementação

```typescript
// user.validations.ts
import { z } from 'zod';
import { idSchema } from '../common/id.validations';

// Schema para criação de usuário
export const createUserSchema = z.object({
  body: z.object({
    name: z.string()
      .min(3, { message: 'O nome deve ter pelo menos 3 caracteres' })
      .max(100, { message: 'O nome deve ter no máximo 100 caracteres' }),
    
    email: z.string()
      .email({ message: 'Email inválido' })
      .toLowerCase(),
    
    password: z.string()
      .min(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
      .regex(/[A-Z]/, { 
        message: 'A senha deve conter pelo menos uma letra maiúscula' 
      })
      .regex(/[0-9]/, { 
        message: 'A senha deve conter pelo menos um número' 
      }),
    
    birthDate: z.string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, { 
        message: 'Data de nascimento deve estar no formato YYYY-MM-DD' 
      })
      .transform((date) => new Date(date))
      .refine((date) => date < new Date(), {
        message: 'Data de nascimento não pode ser no futuro'
      })
  })
});

// Schema para atualização de usuário (campos opcionais)
export const updateUserSchema = z.object({
  params: z.object({
    id: idSchema
  }),
  body: z.object({
    name: z.string()
      .min(3, { message: 'O nome deve ter pelo menos 3 caracteres' })
      .max(100, { message: 'O nome deve ter no máximo 100 caracteres' })
      .optional(),
    
    email: z.string()
      .email({ message: 'Email inválido' })
      .toLowerCase()
      .optional(),
    
    birthDate: z.string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, { 
        message: 'Data de nascimento deve estar no formato YYYY-MM-DD' 
      })
      .transform((date) => new Date(date))
      .refine((date) => date < new Date(), {
        message: 'Data de nascimento não pode ser no futuro'
      })
      .optional()
  }).refine(data => Object.keys(data).length > 0, {
    message: 'Pelo menos um campo deve ser fornecido para atualização'
  })
});

// Schema para busca de usuários
export const getUsersSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    name: z.string().optional(),
    email: z.string().email().optional(),
    orderBy: z.enum(['name', 'email', 'createdAt']).optional(),
    order: z.enum(['asc', 'desc']).optional()
  })
});
```

## Integração com Middlewares

Os esquemas de validação são utilizados pelo middleware de validação:

```typescript
// Em uma rota
import { validateRequest } from '@/middlewares/validate-request.middlewares';
import { createUserSchema } from '@/validations/user/user.validations';

router.post('/users', validateRequest(createUserSchema), userController.createUser);
```

## Boas Práticas

- Divida os esquemas por entidade ou domínio de negócio
- Reutilize validações comuns para manter consistência
- Forneça mensagens de erro claras e específicas
- Use transformações para normalizar dados quando apropriado
- Implemente validações complexas usando o método `.refine()`
- Defina tipos TypeScript a partir dos esquemas Zod para garantir consistência
- Documente regras de validação complexas com comentários
- Mantenha as validações alinhadas com as regras de negócio
- Leve em consideração a internacionalização das mensagens de erro 