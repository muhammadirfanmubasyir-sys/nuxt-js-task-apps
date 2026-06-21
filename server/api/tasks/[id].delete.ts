import { eq } from "drizzle-orm";
import { z } from "zod";
import db from "~/lib/db";
import { tasks } from "~/lib/db/schema";

const IdParamsSchema = z.object({
  id: z.coerce.number(),
});

export default defineEventHandler(async (event) => {
  const idResult = await getValidatedRouterParams(event, IdParamsSchema.safeParse);

  if (!idResult.success) {
    return sendError(event, createError({
      statusCode: 422,
      statusMessage: "Invalid id",
    }));
  }

  const [deleted] = await db.delete(tasks)
    .where(eq(tasks.id, idResult.data.id))
    .returning();

  if (!deleted) {
    return sendError(event, createError({
      statusCode: 404,
      statusMessage: "Task not found",
    }));
  }

  return { success: true };
});
