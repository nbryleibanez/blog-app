"use client"

import {
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "@/app/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const FormSchema = z.object({
  title: z.string(),
  content: z.string(),
});

export default function PostForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setLoading(true);

    const token = await getCookie("access_token");

    const input = {
      title: form.getValues().title,
      content: form.getValues().content,
    };

    const res = await fetch(`http://127.0.0.1:5000/posts`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      toast(`Something happened`, {
        description: "We're fixing this, Houston.",
      });
      setLoading(false);
      return;
    }

    toast("Success", {
      description: "Habit successfully created.",
    });

    setLoading(false); // reset loading state after successful submission
    router.push("/");
    router.refresh();
  };

  return (
    <>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Write something..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <CardFooter className="p-0">
              <Button disabled={loading} className="w-full" type="submit">
                {loading ? <LoadingSpinner /> : "Submit"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </>
  )
}
