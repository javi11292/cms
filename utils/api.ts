/* eslint-disable @typescript-eslint/no-explicit-any */

import * as fields from "$lib/cms.config";
import { prisma } from "$lib/core/utils";
import type { Action, RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";
import type { Entry } from "./types";

export const setupGET =
	(table: keyof typeof fields): RequestHandler =>
	async ({ platform }: Parameters<RequestHandler>["0"]) => {
		return json(await (prisma(platform)[table] as any).findMany());
	};

export const setupLoad =
	(table: keyof typeof fields) =>
	async ({ platform }: { platform: App.Platform | undefined }) => {
		return { entries: (await (prisma(platform)[table] as any).findMany()) as Entry[] };
	};

export const setupActions = (table: keyof typeof fields) => ({
	post: async ({ platform, request }: Parameters<Action>["0"]) => {
		const data = Object.fromEntries(await request.formData());

		const id = typeof data.id === "string" && parseInt(data.id);

		if (id) {
			await (prisma(platform)[table] as any).update({ data: { ...data, id }, where: { id } });
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
