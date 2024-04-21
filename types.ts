import type { Prisma } from "@prisma/client";
import type { ComponentType } from "svelte";

type Field = {
	component?: ComponentType;
	label: string;
	required?: boolean;
	props?: Record<string, unknown>;
};

export type Fields = Record<string, Field>;
export type Model = Lowercase<Prisma.ModelName>;
export type Entry = Record<string, unknown>;
