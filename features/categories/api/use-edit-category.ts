import { InferRequestType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { client } from "@/lib/hono";

type ResponseType = InferRequestType<
  (typeof client.api.categories)[":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.categories)[":id"]["$patch"]
>["json"];

export const useEditCategory = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.categories[":id"]["$patch"]({
        param: { id },
        json,
      });
      const responseData = await response.json();

      // Check if the response contains an error
      if ("error" in responseData) {
        throw new Error(responseData.error);
      } else {
        // Return a dummy object with an empty param field
        return { param: {}, json: responseData.data };
      }
    },
    onSuccess: () => {
      toast.success("Category edit successfully");
      queryClient.invalidateQueries({ queryKey: ["category", { id }] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      //TODO: Invalidate summary and transaction
    },
    onError: (error) => {
      toast.error("Failed to edit category: " + error.message);
    },
  });
  return mutation;
};
