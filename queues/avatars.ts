import { children, queue, z } from "@turboq/sdk";
import resizeQueue from "./resize";

export default queue("Generate all avatar sizes")
  .input(
    z.object({
      userId: z.string(),
      sourceImageUrl: z.string(),
    })
  )
  .step(({ input }) =>
    children()
      .add("low", {
        queue: resizeQueue,
        input: {
          sourceImageUrl: input.sourceImageUrl,
          width: 40,
          height: 40,
        },
      })
      .add("medium", {
        queue: resizeQueue,
        input: {
          sourceImageUrl: input.sourceImageUrl,
          width: 80,
          height: 80,
        },
      })
      .add("high", {
        queue: resizeQueue,
        input: {
          sourceImageUrl: input.sourceImageUrl,
          width: 240,
          height: 240,
        },
      })
  )
  .step("saveUrlsToDatabase", async ({ input, low, medium, high }) => {
    const avatarUrls = {
      low: low.resizeAndUpload.url,
      medium: medium.resizeAndUpload.url,
      large: high.resizeAndUpload.url,
    };

    // Save the URLs to the database (Drizzle example)
    // await db
    //   .update(users)
    //   .set({
    //     avatar: avatarUrls
    //    })
    //   .where(eq(users.id, input.userId));
  });
