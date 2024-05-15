import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetCategories = () => {
  const query = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const reponse = await client.api.categories.$get();

      if (!reponse.ok) {
        throw new Error("Failed to fetch categories");
      }

      const { data } = await reponse.json();
      return data;
    },
  });
  return query;
};
