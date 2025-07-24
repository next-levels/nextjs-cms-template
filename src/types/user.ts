import type { Order } from "./order";

type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  orders?: Order[];
};

enum Roles {
  SUPERADMIN = "SUPERADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
}

type Role = keyof typeof Roles;

export type { User, Role };
export { Roles };
