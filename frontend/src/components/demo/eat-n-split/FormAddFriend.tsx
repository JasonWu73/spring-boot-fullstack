import { Button } from "@/components/ui/Button.tsx";
import { z } from "zod";
import { type Control, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/Form.tsx";
import { Input } from "@/components/ui/Input.tsx";
import { type Friend } from "@/components/demo/eat-n-split/EatAndSplit.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card.tsx";

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
    <Card className="w-96 bg-amber-100 dark:bg-amber-100 dark:text-slate-700 text-slate-700 p-4">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Add a friend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <ControlledFormField
              control={form.control}
              name="name"
              label="👫 Friend name"
              placeholder="Friend name"
              isError={form.getFieldState("name")?.invalid}
            />

            <ControlledFormField
              control={form.control}
              name="image"
              label="🌄 Image URL"
              placeholder="Image URL"
              isError={form.getFieldState("image")?.invalid}
            />

            <Button type="submit" className="self-end">Add</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

type ControllerFormFieldProps = {
  control: Control<FormSchema>;
  name: "name" | "image";
  label: string;
  placeholder: string;
  isError?: boolean;
};

function ControlledFormField({ control, name, label, placeholder, isError }: ControllerFormFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="md:flex md:items-center md:justify-center md:flex-wrap">
          <FormLabel className="min-w-[120px]">{label}</FormLabel>
          <FormControl className="bg-slate-100 md:flex-1">
            <Input type="text" placeholder={placeholder} {...field} isError={isError} />
          </FormControl>
          <FormMessage className="w-full" />
        </FormItem>
      )}
    />
  );
}