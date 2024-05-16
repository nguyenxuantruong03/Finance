import { InferRequestType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { client } from "@/lib/hono";

type ResponseType = InferRequestType<
  (typeof client.api.transactions)[":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.transactions)[":id"]["$patch"]
>["json"];

export const useEdittransaction = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.transactions[":id"]["$patch"]({
        param: { id },
        json,
      });
      const responseData: {
        data?: {
          date: string;
          id: string;
          accountId: string;
          amount: number;
          payee: string;
          notes: string;
          categoryId: string;
        };
        error?: string;
      } = await response.json();

      if (responseData.data) {
        // Convert the date string to a Date object
        const date = new Date(responseData.data.date);
        // Return the data with the date converted
        return {
          param: { id }, // Include the param
          json: {
            ...responseData.data,
            date,
          },
        };
      } else {
        throw new Error("Response data is missing");
      }
    },
    onSuccess: () => {
      toast.success("Transaction edit successfully");
      queryClient.invalidateQueries({ queryKey: ["transaction", { id }] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      //TODO: Invalidate summary
    },
    onError: (error) => {
      toast.error("Failed to edit transaction: " + error.message);
    },
  });
  return mutation;
};
