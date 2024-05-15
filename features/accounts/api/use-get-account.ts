import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetAccount = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["accounts",{id}],
    queryFn: async () => {
      const reponse = await client.api.accounts[":id"].$get({
        param: {id}
      });

      if (!reponse.ok) {
        throw new Error("Failed to fetch account");
      }

      const { data } = await reponse.json();
      return data;
    },
  });
  return query;
};
