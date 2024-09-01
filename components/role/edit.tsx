import { Button } from '@/components/common/button';
import { Tooltip } from '@/components/common/tooltip';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Role } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { RoleFormValues, defaultRoleFormValues, roleSchema } from './data';

import { saveRole } from '@/lib/role';
import { toast } from '../ui/use-toast';
import { RolePermissionsUsersSetting } from './permissions';

export interface RoleEditFormProps {
  editingRole?: Role | null;
}

export const RoleEditForm = (props: Readonly<RoleEditFormProps>) => {
  const { editingRole } = props;
  const router = useRouter();
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: editingRole ?? defaultRoleFormValues,
    mode: 'onChange'
  });

  const onSubmit = async (roleData: RoleFormValues) => {
    try {
      const savedRole = await saveRole(roleData, editingRole?.id);
      toast({
        title: 'Success',
        description: `Role ${savedRole.name} saved successfully.`
      });

      !editingRole && router.push(`/dashboard/roles/edit?id=${savedRole.id}`);
      form.reset(savedRole);
    } catch (e: any) {}
  };

  return (
    <div>
      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex">
                  <Tooltip tip="This is the name of your role." icon={true}>
                    <span className="mr-1">Name</span>
                  </Tooltip>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    autoComplete="auto"
                    placeholder="Role name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex">
                  <span className="mr-1">Description</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    autoComplete="auto"
                    placeholder="Role Description"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="root"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      name="root"
                      id="root"
                      aria-readonly
                    />
                    <Label htmlFor="root" className="flex gap-1 align-middle">
                      <Tooltip
                        tip="Root roles have full access to all resources."
                        icon={true}
                      >
                        Is root?
                      </Tooltip>
                    </Label>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <RolePermissionsUsersSetting
            editingRole={editingRole}
            onResourcesUpdated={(update) => {
              if (update?.$add) {
                form.setValue('$add.permissions', update.$add);
              }

              if (update?.$clear) {
                form.setValue('$clear.permissions', update.$clear);
              }
            }}
            onUsersUpdated={(update) => {
              if (update?.$add) {
                form.setValue('$add.users', update.$add);
              }

              if (update?.$clear) {
                form.setValue('$clear.users', update.$clear);
              }
            }}
          />
          <Button type="submit">Save</Button>
        </form>
      </Form>
    </div>
  );
};
