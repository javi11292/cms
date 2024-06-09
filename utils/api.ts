/* eslint-disable @typescript-eslint/no-explicit-any */

import { prisma } from "$lib/core/utils";
import type { Prisma } from "@prisma/client";
import type { Action, RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";
import type { Item } from "./types";

type Model = Uncapitalize<Prisma.ModelName>;

export const setupLoad =
	<T = Item>(table: Model) =>
	async ({ platform }: { platform: App.Platform | undefined }) => {
		return { items: (await (prisma(platform)[table] as any).findMany()) as T[] };
	};

export const setupGET =
	(table: Model) =>
	async ({ platform }: Parameters<RequestHandler>["0"]) => {
		return json(await (prisma(platform)[table] as any).findMany());
	};

export const setupActions = (table: Model) => ({
	post: async ({ platform, request }: Parameters<Action>["0"]) => {
		const { id, ...data } = Object.fromEntries(await request.formData());

		if (id) {
			const numberId = parseInt(id as string);
			await (prisma(platform)[table] as any).update({
				data: { ...data, id: numberId },
				where: { id: numberId },
			});
		} else {
			await (prisma(platform)[table] as any).create({ data });
		}
	},

	delete: async ({ platform, request }: Parameters<Action>["0"]) => {
		const data = await request.formData();
		const id = data.get("id") as string;

		await (prisma(platform)[table] as any).delete({ where: { id: parseInt(id) } });
	},
});
