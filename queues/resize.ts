import { queue, z } from "@turboq/sdk";
import sharp from "sharp";
import { download } from "../utils/download";
import { upload } from "../utils/upload";

export default queue("Resize image")
  .input(
    z.object({
      sourceImageUrl: z.string(),
      width: z.number().min(1),
      height: z.number().min(1),
    })
  )
  .step("resizeAndUpload", async ({ input }) => {
    const image = await download(input.sourceImageUrl);

    const resizedImage = await sharp(image)
      .resize(input.width, input.height)
      .toFormat("jpeg")
      .toBuffer();

    const url = await upload(resizedImage);

    return { url };
  });
