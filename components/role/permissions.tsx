import { SystemError } from '@/components/common/error';
import { Loading } from '@/components/common/loading';
import { Label } from '@/components/ui/label';
import { getPermissionList, getRole, getUserListByRoleId } from '@/lib/role';
import { getUsersList } from '@/lib/user';
import { RelationContentArrayUpdate, Role, User } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { Edit, Info, List, Plus, X } from 'lucide-react';
import {
  FancyMultiSelect,
  IFancyMultiSelect
} from '../common/fancy-multi-select';
import { Tooltip } from '../common/tooltip';
export interface RolePermissionsUsersSettingProps {
  editingRole?: Role | null;
  onResourcesUpdated?: (resources?: RelationContentArrayUpdate | null) => void;
  onUsersUpdated?: (users?: RelationContentArrayUpdate | null) => void;
}
const getIconForAction = (action: string) => {
  switch (action) {
    case 'list':
      return <List className="h-4 w-4" />;
    case 'create':
      return <Plus className="h-4 w-4" />;
    case 'detail':
      return <Info className="h-4 w-4" />;
    case 'update':
      return <Edit className="h-4 w-4" />;
    case 'delete':
      return <X className="h-4 w-4" />;
    default:
      return null;
  }
};
const convertToFancyMultiSelect = (
  permissions: string[]
): IFancyMultiSelect[] => {
  return permissions.map((permission) => {
    const [category, action] = permission.split('.');

    // Lấy biểu tượng cho hành động
    const icon = getIconForAction(action);

    // Tạo label với giá trị và biểu tượng
    const label = (
      <div className="flex items-center gap-2">
        {icon} {permission}
      </div>
    );

    return {
      value: permission,
      label: label
    };
  });
};
const convertUserToFancyMultiSelect = (users: User[]): IFancyMultiSelect[] => {
  return users.map((user) => ({
    value: user.id, // Hoặc bạn có thể dùng `user.username` hoặc `user.email` tùy vào nhu cầu
    label: (
      <div className="flex items-center gap-2">
        <Tooltip tip={user.email}>
          <img
            src={user.image ? user.image : 'https://i.imgur.com/rLpAsb4.png'}
            alt={user.name}
            className="h-8 w-8 rounded-full"
          />
        </Tooltip>

        <span>{user.name}</span>
      </div>
    )
  }));
};
export const RolePermissionsUsersSetting = (
  props: RolePermissionsUsersSettingProps
) => {
  const { editingRole, onResourcesUpdated, onUsersUpdated } = props;
  const roleId = editingRole?.id ?? 0;
  const {
    data: combinedData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['combinedDataRole', 1],
    queryFn: async () => {
      const [permissionsSelected, userListSelected, userList, permissionList] =
        await Promise.all([
          getRole(roleId),
          getUserListByRoleId(roleId, 100, 1),
          getUsersList(100, 1),
          getPermissionList()
        ]);

      return {
        permissionsSelected,
        userListSelected,
        userList,
        permissionList
      };
    },
    retry: false,
    refetchOnWindowFocus: false
  });

  if (isLoading) return <Loading />;
  if (error) return <SystemError error={error} />;
  const permissionsSelected = combinedData?.permissionsSelected?.permissions;
  const userListSelected = combinedData?.userListSelected.items;
  const userList = combinedData?.userList.items;
  const permissionList = combinedData?.permissionList;

  return (
    <>
      <div className="space-y-1">
        <Label htmlFor="name">Permissions</Label>
        <FancyMultiSelect
          onChange={(value) => {
            if (onResourcesUpdated) {
              onResourcesUpdated(value);
            }
          }}
          placeholder="Select permission"
          data={convertToFancyMultiSelect(permissionList ?? [])}
          selected={convertToFancyMultiSelect(permissionsSelected ?? [])}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="username">Users</Label>
        <FancyMultiSelect
          onChange={(value) => {
            if (onUsersUpdated) {
              onUsersUpdated(value);
            }
            // Handle the selected users
          }}
          placeholder="Select user"
          data={convertUserToFancyMultiSelect(userList ?? [])}
          selected={convertUserToFancyMultiSelect(userListSelected ?? [])}
        />
      </div>
    </>
  );
};
