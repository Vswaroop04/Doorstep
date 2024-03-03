"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Provider } from "@/lib/types/authType";
import { editProvider } from "@/lib/fetchers/editProvider";

export function AccountForm({ provider }: { provider: Provider }) {
  const router = useRouter();

  const accountFormSchema = z.object({
    name: z
      .string()
      .min(2, {
        message: "Name must be at least 2 characters.",
      })
      .max(30, {
        message: "Name must not be longer than 30 characters.",
      })
      .optional(),
    offlineDuration: z
      .union([
        z.string(), // Allow strings
        z.number(), // Allow numbers
      ])
      .optional(),
    onlinePrice: z
      .union([
        z.string(), // Allow strings
        z.number(), // Allow numbers
      ])
      .optional(),
    offlinePrice: z
      .union([
        z.string(), // Allow strings
        z.number(), // Allow numbers
      ])
      .optional(),
  });

  type AccountFormValues = z.infer<typeof accountFormSchema>;

  const defaultValues: Partial<AccountFormValues> = {
    name: provider?.name,
    offlineDuration: provider?.offlineDuration,
    onlinePrice: provider?.onlinePrice,
    offlinePrice: provider?.offlinePrice,
  };
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  });

  async function onSubmit(data: AccountFormValues) {
    try {
      toast.loading(`Updating Profile`);
      const convertedData = {
        ...data,
        offlineDuration: Number(data.offlineDuration) || 0,
        onlinePrice: Number(data.onlinePrice) || 0,
        offlinePrice: Number(data.offlinePrice) || 0,
      };

      await editProvider(convertedData);
      toast.success("Profile Updated Succesfully");
    } catch (e) {
      toast.error("Error Occured");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormDescription>
                This is the name that will be displayed on your profile and in
                emails.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="offlineDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Offline Duration</FormLabel>
              <FormControl>
                <Input placeholder="3 Hrs" {...field} />
              </FormControl>
              <FormDescription>
                This is the offline Duration that will be used to suggest you
                offline meetings
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="onlinePrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Online Price (in $) </FormLabel>
              <FormControl>
                <Input placeholder="5 $" {...field} />
              </FormControl>
              <FormDescription>
                This is the online price which is used initially to show users
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="offlinePrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Offline Price (in $) </FormLabel>
              <FormControl>
                <Input placeholder="5 $" {...field} />
              </FormControl>
              <FormDescription>
                This is the offline price which is used initially to show users
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Update account</Button>
      </form>
    </Form>
  );
}
