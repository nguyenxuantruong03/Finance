import { z } from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertCategoriesSchema } from "@/db/schema";
import {
  FormControl,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = insertCategoriesSchema.pick({
  name: true,
});

type FormValues = z.input<typeof formSchema>;

type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  onDelete?: () => void;
  disable: boolean;
};

export const CategoryForm = ({
  id,
  defaultValues,
  onSubmit,
  disable,
  onDelete,
}: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values)
  };

  const handleDelete = () => {
    onDelete?.();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 pt-4"
      >
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  disabled={disable}
                  placeholder="e.g. Cash, Bank, Creadit Card"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="w-full" disabled={disable}>
          {id ? "Save Change" : "Create category"}
        </Button>
        {!!id && (
          <Button
            type="button"
            disabled={disable}
            onClick={handleDelete}
            size="icon"
            className="w-full"
            variant="outline"
          >
            <Trash className="size-4 mr-2" />
            Delete Category
          </Button>
        )}
      </form>
    </Form>
  );
};
