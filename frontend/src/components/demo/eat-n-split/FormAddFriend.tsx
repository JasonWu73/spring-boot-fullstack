import { Button } from "@/components/ui/Button.tsx";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/Form.tsx";
import { Input } from "@/components/ui/Input.tsx";

const formSchema = z.object(
  {
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    image: z.string().url({ message: "Image must be a valid URL" })
  }
);

export default function FormAddFriend() {
  const form = useForm<z.infer<typeof formSchema>>(
    {
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: "",
        image: ""
      }
    }
  );

  function handleSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="p-4 flex flex-col gap-4 rounded border shadow-sm bg-amber-100 text-slate-700"
      >
        <FormField
          control={form.control}
          name="name"
          render={
            ({ field }) => (
              <FormItem>
                <FormLabel>👫 Friend name</FormLabel>
                <FormControl>
                  <Input placeholder="Friend name" {...field} />
                </FormControl>
              </FormItem>
            )
          }
        />

        <FormField
          control={form.control}
          name="image"
          render={
            ({ field }) => (
              <FormItem>
                <FormLabel>🌄 Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="Image URL" {...field} />
                </FormControl>
              </FormItem>
            )
          }
        />

        <div className="self-end">
          <Button type="submit">Add</Button>
        </div>
      </form>
    </Form>
  );
}