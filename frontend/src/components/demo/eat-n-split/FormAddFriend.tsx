import { Button } from "@/components/ui/Button.tsx";
import { z } from "zod";
import { type Control, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/Form.tsx";
import { Input } from "@/components/ui/Input.tsx";
import { type Friend } from "@/components/demo/eat-n-split/EatAndSplit.tsx";

type FormAddFriendProps = {
  onAddFriend: (friend: Friend) => void;
};

const formSchema = z.object({
  name: z.string().nonempty("Must enter a name"),
  image: z.string().url({ message: "Image must be a valid URL" })
});

type FormSchema = z.infer<typeof formSchema>;

export default function FormAddFriend({ onAddFriend }: FormAddFriendProps) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      image: "" // https://i.pravatar.cc/150?u=xxx
    }
  });

  function onSubmit(values: FormSchema) {
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
        <ControlledFormField control={form.control} name="name" label="👫 Friend name" placeholder="Friend name" />

        <ControlledFormField control={form.control} name="image" label="🌄 Image URL" placeholder="Image URL" />

        <Button type="submit" className="self-end">Add</Button>
      </form>
    </Form>
  );
}

type ControllerFormFieldProps = {
  control: Control<FormSchema>;
  name: "name" | "image";
  label: string;
  placeholder: string;
};

function ControlledFormField({ control, name, label, placeholder }: ControllerFormFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="lg:flex flex-wrap items-center justify-between">
          <FormLabel className="min-w-[120px]">{label}</FormLabel>
          <FormControl className="bg-white flex-1">
            <Input placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage className="w-full" />
        </FormItem>
      )}
    />
  );
}