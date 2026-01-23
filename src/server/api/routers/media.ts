import { router } from "../trpc";
import { protectedProcedure } from "../trpc";

export const mediaRouter = router({
  list: protectedProcedure.query(({ ctx }) => {
    return ctx.db.media.findMany({ orderBy: { createdAt: "desc" } });
  }),
});

export default mediaRouter;
