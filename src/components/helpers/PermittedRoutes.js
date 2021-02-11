import { permissionConstants } from './PermissionConstants';

export const permittedRoutes = {
  adminRoutes: [
    {
      url: '/admin',
      permissions: [permissionConstants.role.ADMIN_ROLE]
    },
    {
      url: '/healthcare',
      permissions: [permissionConstants.role.ADMIN_ROLE]
    },
    {
      url: '/healthcare/residents',
      permissions: [permissionConstants.role.ADMIN_ROLE]
    },
    {
      url: '/healthcare/groups',
      permissions: [permissionConstants.role.ADMIN_ROLE]
    },
    {
      url: '/healthcare/communities',
      permissions: [permissionConstants.role.ADMIN_ROLE]
    },
    {
      url: '/healthcare/reports',
      permissions: [permissionConstants.role.ADMIN_ROLE]
    },
    {
      url: '/healthcare-settings',
      permissions: [permissionConstants.role.ADMIN_ROLE]
    }
  ],
  employeeRoutes: [
    {
      url: '/employee',
      permissions: [permissionConstants.role.EMPLOYEE_ROLE]
    }
  ],
  commonRoutes: [
    {
      url: '/my-profile',
      permissions: [permissionConstants.role.ADMIN_ROLE, permissionConstants.role.EMPLOYEE_ROLE]
    },
    {
      url: '/change-password',
      permissions: [permissionConstants.role.ADMIN_ROLE, permissionConstants.role.EMPLOYEE_ROLE]
    },
    {
      url: '/dashboard',
      permissions: [permissionConstants.role.ADMIN_ROLE, permissionConstants.role.EMPLOYEE_ROLE]
    },
    {
      url: '/give-feedback',
      permissions: [permissionConstants.role.ADMIN_ROLE, permissionConstants.role.EMPLOYEE_ROLE]
    }
  ]
};
