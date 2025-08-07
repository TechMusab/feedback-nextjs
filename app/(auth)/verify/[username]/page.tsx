"use client"
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { verifySchema } from "@/app/schemas/veirfySchema";
import { z } from "zod";
import axios from "axios";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {Loader2} from "lucide-react"
export default function Page() {
  const router = useRouter();
  const param = useParams<{ username: string }>();
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
        otp: "", 
      },
  });
  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
        console.log("Form data submitted:", data);
      const res = await axios.post("/api/verifyOTP", {
        code: data.otp,
        username: param.username,
      });
      console.log("Response from verification:", res.data);
      if (res.data.success) {
        toast.success("Verification successful! You can now log in.");
        router.push("/sign-in");
      } else {
        toast.error(
          res.data.message || "Verification failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Error during verification:", error);
      toast.error("An error occurred during verification. Please try again.");
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">
            Enter the verification code sent to your email to activate your
            account.
          </p>
        </div>
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <Input placeholder="Enter otp" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Verify</Button>
      </form>
    </Form>
      </div>
    </div>
  );
}
