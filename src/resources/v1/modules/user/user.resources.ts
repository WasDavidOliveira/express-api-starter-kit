import { UserModel } from '@/types/models/v1/auth.types';

export class UserResource {
  static toResponse(user: UserModel) {
    const { password: _password, ...userSafe } = user;

    return userSafe;
  }

  static toResponseBasic(user: UserModel) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static collectionToResponse(users: UserModel[]) {
    return users.map((user) => this.toResponse(user));
  }
}
