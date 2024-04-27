export async function download(url: string) {
  const response = await fetch(url);
  if (!response.ok)
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  return Buffer.from(await response.arrayBuffer());
}
