import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetTransaction = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["transaction",{id}],
    queryFn: async () => {
      const reponse = await client.api.transactions[":id"].$get({
        param: {id}
      });

      if (!reponse.ok) {
        throw new Error("Failed to fetch transaction");
      }

      const { data } = await reponse.json();
      return data;
    },
  });
  return query;
};
