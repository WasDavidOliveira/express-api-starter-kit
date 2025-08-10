import appConfig from '@/configs/app.config';
import { NotFoundError } from '@/utils/app-error.utils';
import UserRepository from '@/repositories/v1/modules/auth/user.repository';
import { UnauthorizedError } from '@/utils/app-error.utils';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { LoginInput, RegisterInput } from '@/validations/v1/modules/auth.validations';

export class AuthService {
  async login(data: LoginInput) {
    const user = await UserRepository.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedError('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Credenciais inválidas');
    }

    // @ts-expect-error
    const token = jwt.sign({ id: user.id }, appConfig.jwtSecret, {
      expiresIn: appConfig.jwtExpiration,
    });

    return {
      token,
    };
  }

  async register(data: RegisterInput) {
    const userData: RegisterInput = data;

    const passwordHash = await bcrypt.hash(userData.password, 10);

    const user = await UserRepository.create({
      ...userData,
      password: passwordHash,
    });

    return user;
  }

  async me(userId: number) {
    const user = await UserRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    return user;
  }
}

export default new AuthService();
