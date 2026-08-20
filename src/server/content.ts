import { createServerFn } from "@tanstack/react-start";

export const fetchContent = createServerFn({
  method: "GET",
})
  .validator((collectionId: string) => collectionId)
  .handler(async ({ data: collectionId }) => {
    const key =
      process.env.OPERON_KEY ??
      process.env.VITE_OPERON_KEY ??
      import.meta.env.VITE_OPERON_KEY;

    if (!key) {
      console.warn("[fetchContent] OPERON_KEY is not configured");
      return null;
    }

    const backendUrl =
      process.env.OPERON_COMPOSE_BACKEND_URL ??
      process.env.VITE_OPERON_COMPOSE_BACKEND_URL ??
      import.meta.env.VITE_OPERON_COMPOSE_BACKEND_URL;

    if (!backendUrl) {
      console.warn("[fetchContent] OPERON_COMPOSE_BACKEND_URL is not configured");
      return null;
    }

    try {
      const response = await fetch(
        `${backendUrl}/api/content/operon-compose/${collectionId}`,
        {
          headers: {
            "x-Operon-key": key,
          },
        },
      );

      if (!response.ok) {
        console.warn(
          `[fetchContent] Failed to fetch content for ${collectionId}: ${response.status} ${response.statusText}`,
        );
        return null;
      }

      return await response.json();
    } catch (err) {
      console.error(`[fetchContent] Error fetching content for ${collectionId}:`, err);
      return null;
    }
  });
