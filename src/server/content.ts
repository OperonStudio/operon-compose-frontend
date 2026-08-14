import { createServerFn } from "@tanstack/react-start";

const OPERON_KEY = import.meta.env.VITE_OPERON_KEY;

if (!OPERON_KEY) {
  throw new Error("OPERON_KEY is not configured");
}

export const fetchContent = createServerFn({
  method: "GET",
})
  .validator((collectionId: string) => collectionId)
  .handler(async ({ data: collectionId }) => {
    const response = await fetch(
      `${import.meta.env.VITE_OPERON_COMPOSE_BACKEND_URL}/api/content/operon-compose/${collectionId}`,
      {
        headers: {
          "x-Operon-key": OPERON_KEY,
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch content: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  });
