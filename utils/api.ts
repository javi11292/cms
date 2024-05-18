/* eslint-disable @typescript-eslint/no-explicit-any */

import * as fields from "$lib/cms.config";
import { prisma } from "$lib/core/utils";
import type { RequestHandler, ServerLoad } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";

export const setupPOST =
	(table: keyof typeof fields) =>
	async ({ platform, request }: Parameters<RequestHandler>["0"]) => {
		const data = await request.json();

		if (data.id) {
			await (prisma(platform)[table] as any).update({ data, where: { id: data.id } });
		} else {
			await (prisma(platform)[table] as any).create({ data });
		}

		return new Response();
	};

export const setupGET =
	(table: keyof typeof fields) =>
	async ({ platform }: Parameters<RequestHandler>["0"]) => {
		return json(await (prisma(platform)[table] as any).findMany());
	};

export const setupDELETE =
	(table: keyof typeof fields) =>
	async ({ platform, request }: Parameters<RequestHandler>["0"]) => {
		const { id } = await request.json();

		return json(await (prisma(platform)[table] as any).delete({ where: { id } }));
	};

export const setupLoad =
	(api: string) =>
	async ({ fetch, depends }: Parameters<ServerLoad>["0"]) => {
    depends(`cms:${api}`);

		return { entries: await fetch(api).then((response) => response.json()), api };
	};
