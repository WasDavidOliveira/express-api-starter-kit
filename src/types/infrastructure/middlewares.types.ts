export type UserWithRoles = {
  id: number;
  name: string;
  email: string;
  userRoles: Array<{
    userId: number;
    roleId: number;
    role: {
      id: number;
      name: string;
      description: string;
    };
  }>;
};

export type UserRole = {
  userId: number;
  roleId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type UserWithRole = UserWithRoles;
