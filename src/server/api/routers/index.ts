import { router } from "../trpc";
import { contentRouter } from "./content";
import { mediaRouter } from "./media";

export const appRouter = router({
  content: contentRouter,
  media: mediaRouter,
});

export type AppRouter = typeof appRouter;
