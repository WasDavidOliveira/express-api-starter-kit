import { faker } from '@faker-js/faker';
import { CreateUserModel, UserModel } from '@/types/models/v1/auth.types';
import bcrypt from 'bcrypt';
import UserRepository from '@/repositories/v1/modules/auth/user.repository';
import {
  LoginInput,
  RegisterInput,
} from '@/validations/v1/modules/auth.validations';
import jwt from 'jsonwebtoken';
import appConfig from '@/configs/app.config';
import { RoleFactory } from '@/tests/factories/role/role.factory';
import { UserRoleFactory } from '@/tests/factories/user-role/user-role.factory';

type PartialCreateUser = Partial<CreateUserModel>;

class UserFactoryBuilder {
  protected currentName: string;
  protected currentEmail: string;
  protected currentPassword: string;
  protected currentOverrides: PartialCreateUser;

  constructor(overrides: PartialCreateUser = {}) {
    this.currentName = faker.person.fullName();
    this.currentEmail = faker.internet.email().toLowerCase();
    this.currentPassword = 'senha123';
    this.currentOverrides = overrides;
  }

  name(value: string): this {
    this.currentName = value;
    return this;
  }

  email(value: string): this {
    this.currentEmail = value.toLowerCase();

    return this;
  }

  password(value: string): this {
    this.currentPassword = value;

    return this;
  }

  state(overrides: PartialCreateUser): this {
    this.currentOverrides = { ...this.currentOverrides, ...overrides };

    return this;
  }

  make(): RegisterInput {
    return {
      name: this.currentOverrides.name ?? this.currentName,
      email: this.currentOverrides.email ?? this.currentEmail,
      password: this.currentOverrides.password ?? this.currentPassword,
    };
  }

  async create(): Promise<{ user: UserModel; password: string }> {
    const rawPassword = this.currentOverrides.password ?? this.currentPassword;
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    const userData = this.make();
    const newUser = await UserRepository.create({
      ...userData,
      password: passwordHash,
    });

    return {
      user: newUser,
      password: rawPassword,
    };
  }

  async createWithRole(
    roleId?: number,
  ): Promise<{ user: UserModel; password: string }> {
    const { user, password } = await this.create();

    if (roleId) {
      await UserRoleFactory.attachRoleToUser(user.id, roleId);
      return { user, password };
    }

    const role = await RoleFactory.createRole();

    await UserRoleFactory.attachRoleToUser(user.id, role.id);

    return { user, password };
  }

  makeLoginData(email: string = this.currentEmail): LoginInput {
    return {
      email: email.toLowerCase(),
      password: this.currentPassword,
    };
  }

  async createAndGetLoginData(): Promise<{
    user: UserModel;
    loginData: LoginInput;
  }> {
    const { user, password } = await this.create();
    const loginData = this.makeLoginData(user.email);
    loginData.password = password;
    return { user, loginData };
  }
}

export class UserFactory {
  static build(overrides: PartialCreateUser = {}): UserFactoryBuilder {
    return new UserFactoryBuilder(overrides);
  }

  static generateJwtToken(userId: number): string {
    const token = jwt.sign({ id: userId }, appConfig.jwtSecret as string, {
      expiresIn: '24h',
    });

    return token;
  }

  static async createUserAndGetToken(
    overrides: Partial<CreateUserModel> = {},
  ): Promise<{ user: UserModel; token: string }> {
    const { user } = await this.build(overrides).create();
    const token = this.generateJwtToken(user.id);

    return {
      user,
      token,
    };
  }

  static async createUserWithRoleAndGetToken(
    roleId?: number,
    overrides: Partial<CreateUserModel> = {},
  ): Promise<{ user: UserModel; token: string }> {
    const { user } = await this.build(overrides).createWithRole(roleId);
    const token = this.generateJwtToken(user.id);

    return {
      user,
      token,
    };
  }
}
