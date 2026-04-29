import type { Store } from "./product";

export type Student = {
  student_id: string;
  student_name: string;
  is_active: number;
  identityUserId: string;
};

export type Vendor = {
  vendor_id: string;
  vendor_name: string;
  store: Store;
  is_active: number;
  identityUserId: string;
};

export type Admin = {
  admin_id: string;
  name_admin: string;
  is_active: number;
  identityUserId: string;
};
