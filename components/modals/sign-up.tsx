"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import axios, { AxiosError } from "axios";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useModal } from "@/hooks/use-modal-store";
import ImageUpload from "../image-upload";

const schema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(3, "Name must be at least 3 characters"),
  image: z.string({ required_error: "Image is required" }).min(1, "Image is required"),
  email: z.string({ required_error: "Email is required" }).email("Invalid email address"),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),
});

export const SignUpModal = () => {
  const { isOpen, type, onClose, onOpen } = useModal();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      image: "",
      name: "",
      email: "",
      password: "",
    },
  });

  const isModalOpen = isOpen && type === "sign-up";

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      await axios.post("/api/auth/sign-up", values);
      toast.success("Signed in successfully");
      window.location.reload();
    } catch (error: AxiosError | any) {
      toast.error(error.response?.data || error.message);
      form.reset();
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const openSignInModal = () => {
    handleClose();
    onOpen("sign-in");
  };

  const isLoading = form.formState.isSubmitting;

  if (!isModalOpen) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Get started</DialogTitle>
          <DialogDescription>Create a new account</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="image"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile picture</FormLabel>
                  <FormControl>
                    <ImageUpload label="Profile picture" disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="your name" type="text" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@example.com"
                      type="text"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="******" type="password" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <button
              className="flex mt-3 items-center justify-center w-full px-3 py-2 text-background bg-primary rounded-md hover:bg-primary/95 disabled:pointer-events-none disabled:opacity-70 disabled:cursor-not-allowed transition"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {isLoading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
        </Form>
        <DialogFooter>
          <p
            className="cursor-pointer text-sm w-full text-muted-foreground text-justify hover:underline transition"
            onClick={openSignInModal}
          >
            Already have an account? Sign in now
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
