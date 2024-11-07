'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { uploadFile } from '@/lib/media';
import { saveUser } from '@/lib/user';
import { User } from '@/types';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarImage } from '../ui/avatar';

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: 'Username must be at least 2 characters.'
    })
    .max(30, {
      message: 'Username must not be longer than 30 characters.'
    }),
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.'
  }),
  image: z.string().optional(),
  email: z
    .string({
      required_error: 'Please select an email to display.'
    })
    .email(),
  password: z
    .string()
    .min(8, {
      message: 'Password must be at least 8 characters.'
    })
    .optional(),
  role: z.string().optional()
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

// This can come from your database or API.

export interface ProfileFormProps {
  user?: User | null;
  isNewUser?: boolean;
}

export function ProfileForm(props: Readonly<ProfileFormProps>) {
  const { user, isNewUser } = props;
  const router = useRouter();
  const defaultValues: Partial<ProfileFormValues> = {
    name: user?.name,
    username: user?.username,
    email: user?.email,
    image: user?.image,
    role: user?.role_id
  };
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange'
  });

  async function onSubmit(data: ProfileFormValues) {
    try {
      const savedUser = await saveUser(data, user?.id);
      toast({
        title: 'Success',
        description: `User ${savedUser.name} saved successfully.`
      });
      form.reset(savedUser);
      router.push(`/dashboard/user/${savedUser.id}`);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: `Failed to save user .`
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem className="flex flex-col items-center">
              <Input
                type="file"
                accept="image/*"
                id="imageUpload"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    uploadFile(file).then((media) => {
                      field.onChange(media[0].url);
                    });
                  }
                }}
              />
              <label htmlFor="imageUpload" className="cursor-pointer">
                <div className="relative">
                  <Avatar className="mx-auto h-32 w-32">
                    <AvatarImage
                      src={
                        field.value ||
                        user?.image ||
                        'https://i.imgur.com/rLpAsb4.png'
                      }
                      alt="Profile"
                    />
                  </Avatar>
                  <div className="absolute bottom-0 right-0 rounded-full bg-white p-1 shadow-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                </div>
              </label>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name. It can be your real name or a
                pseudonym. You can only change this once every 30 days.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Update profile</Button>
      </form>
    </Form>
  );
}
