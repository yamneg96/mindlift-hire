import type { AnyZodObject, ZodEffects } from "zod";

type Validator = AnyZodObject | ZodEffects<AnyZodObject>;

export function parseBody<T>(schema: Validator, payload: unknown): T {
  return schema.parse(payload) as T;
}

export function parseQuery<T>(schema: Validator, payload: unknown): T {
  return schema.parse(payload) as T;
}
