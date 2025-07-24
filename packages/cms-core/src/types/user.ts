export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  emailVerified?: Date | null;
};

export enum Roles {
  SUPERADMIN = "SUPERADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
}

export type Role = keyof typeof Roles;

export type UserWithoutPassword = Omit<User, "password">;

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  role?: Role;
};

export type UpdateUserInput = Partial<CreateUserInput> & {
  id: string;
};
