import { prisma } from "$lib/core/utils/prisma";
import type { RequestHandler, ServerLoad } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";
import type { Model } from "./types";

export const setupPOST =
	(table: Model) =>
	async ({ platform, request }: Parameters<RequestHandler>["0"]) => {
		const data = await request.json();

		if (data.id) {
			await prisma(platform)[table].update({ data, where: { id: data.id } });
		} else {
			await prisma(platform)[table].create({ data });
		}

		return new Response();
	};

export const setupGET =
	(table: Model) =>
	async ({ platform }: Parameters<RequestHandler>["0"]) => {
		return json(await prisma(platform)[table].findMany());
	};

export const setupDELETE =
	(table: Model) =>
	async ({ platform, request }: Parameters<RequestHandler>["0"]) => {
		const { id } = await request.json();

		return json(await prisma(platform)[table].delete({ where: { id } }));
	};

export const setupLoad =
	(api: string) =>
	async ({ fetch, depends }: Parameters<ServerLoad>["0"]) => {
		depends(api);
		return { entries: await fetch(api).then((response) => response.json()), api };
	};
