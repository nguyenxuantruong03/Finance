import { InferRequestType } from "hono";
import { useMutation,useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {client} from "@/lib/hono"

type ResponseType = { json: { id: string }[] };
type RequestType = InferRequestType<typeof client.api.transactions["bulk-delete"]["$post"]>["json"]

export const useBulkDeleteTransactions = () =>{
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.transactions["bulk-delete"]["$post"]({json})
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
            toast.success("Transactions deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["transaction"] });
            //TODO: Also invalidate sumary
        },
        onError: (error) => {
            toast.error("Failed to delete transaction: " + error.message);
        }
    });
    return mutation
}