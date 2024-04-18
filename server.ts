import { prisma } from "$lib/core/utils/prisma";
import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ platform }) => {
	await prisma(platform, "CMS").post.create({ data: { name: "prueba", description: "prueba" } });

	return new Response();
};
