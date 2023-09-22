import { Button } from "@/components/ui/Button.tsx";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/Form.tsx";
import { Input } from "@/components/ui/Input.tsx";
import { type Friend } from "@/components/demo/eat-n-split/EatAndSplit.tsx";

type FormAddFriendProps = {
  onAddFriend: (friend: Friend) => void;
};

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  image: z.string().url({ message: "Image must be a valid URL" })
});

export default function FormAddFriend({ onAddFriend }: FormAddFriendProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      image: "" // https://i.pravatar.cc/150?u=xxx
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newFriendId = Date.now();

    const newFriend: Friend = {
      id: newFriendId,
      name: values.name,
      image: `${values.image}?u=${newFriendId}`,
      balance: 0
    };

    onAddFriend(newFriend);

    form.reset();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="p-4 flex flex-col gap-4 rounded border shadow-sm bg-amber-100 text-slate-700"
      >
        <FormField
          control={form.control}
          name="name"
          render={
            ({ field }) => (
              <FormItem className="lg:flex flex-wrap items-center justify-between">
                <FormLabel className="min-w-[120px]">👫 Friend name</FormLabel>
                <FormControl className="bg-white flex-1">
                  <Input placeholder="Friend name" {...field} />
                </FormControl>
                <FormMessage className="w-full" />
              </FormItem>
            )
          }
        />

        <FormField
          control={form.control}
          name="image"
          render={
            ({ field }) => (
              <FormItem className="lg:flex flex-wrap items-center justify-between">
                <FormLabel className="min-w-[120px]">🌄 Image URL</FormLabel>
                <FormControl className="bg-white flex-1">
                  <Input placeholder="Image URL" {...field} />
                </FormControl>
                <FormMessage className="w-full" />
              </FormItem>
            )
          }
        />

        <Button type="submit" className="self-end">Add</Button>
      </form>
    </Form>
  );
}