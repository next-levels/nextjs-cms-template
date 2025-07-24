import { Roles, type Role } from "../types/user";

export const ROLE_HIERARCHY: Record<Role, number> = {
  [Roles.USER]: 1,
  [Roles.ADMIN]: 2,
  [Roles.SUPERADMIN]: 3,
};

export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  [Roles.USER]: ["read:own"],
  [Roles.ADMIN]: ["read:own", "read:all", "create", "update:all", "delete:all"],
  [Roles.SUPERADMIN]: ["*"],
};

export function hasRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function hasPermission(userRole: Role, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[userRole];
  return permissions.includes("*") || permissions.includes(permission);
}

export function canAccessAdmin(userRole: Role): boolean {
  return hasRole(userRole, Roles.ADMIN);
}

export function canManageUsers(userRole: Role): boolean {
  return hasRole(userRole, Roles.SUPERADMIN);
}
