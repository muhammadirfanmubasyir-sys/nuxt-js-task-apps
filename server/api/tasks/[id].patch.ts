import { eq } from "drizzle-orm";
import { z } from "zod";
import db from "~/lib/db";
import { tasks, PatchTasksSchema } from "~/lib/db/schema";

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

  const bodyResult = await readValidatedBody(event, PatchTasksSchema.safeParse);

  if (!bodyResult.success) {
    return sendError(event, createError({
      statusCode: 422,
      statusMessage: "Invalid payload",
    }));
  }

  const [updated] = await db.update(tasks)
    .set(bodyResult.data)
    .where(eq(tasks.id, idResult.data.id))
    .returning();

  if (!updated) {
    return sendError(event, createError({
      statusCode: 404,
      statusMessage: "Task not found",
    }));
  }

  return updated;
});
