export type Role = "Student" | "Vendor" | "Admin";

export type LoginDTO = {
  email: string;
  password: string;
};

export type RegisterDTO = {
  email: string;
  password: string;
  role: Role;
};

export type AuthUser = {
  email: string;
  role: Role;
  token: string;
};
