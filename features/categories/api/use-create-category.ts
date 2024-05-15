import { InferRequestType } from "hono";
import { useMutation,useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {client} from "@/lib/hono"

type ResponseType = InferRequestType<typeof client.api.categories.$post>
type RequestType = InferRequestType<typeof client.api.categories.$post>["json"]

export const useCreateCategory = () =>{
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.categories.$post({ json });
            const responseData = await response.json();
            
            // Check if the response contains an error
            if ('error' in responseData) {
                throw new Error(responseData.error);
            } else {
                // Return the data in the expected format
                return { json: responseData.data };
            }
        },
        onSuccess: () => {
            toast.success("Category created successfully");
            queryClient.invalidateQueries({ queryKey: ["category"] });
        },
        onError: (error) => {
            toast.error("Failed to create category: " + error.message);
        }
    });
    return mutation
}