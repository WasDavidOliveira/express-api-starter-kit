import appConfig from '@/configs/app.config';
import { NotFoundError, UnauthorizedError } from '@/utils/core/app-error.utils';
import UserRepository from '@/repositories/v1/modules/auth/user.repository';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { LoginInput, RegisterInput, ForgotPasswordInput, ResetPasswordInput } from '@/validations/v1/modules/auth.validations';

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

    const token = jwt.sign(
      { id: user.id },
      appConfig.jwtSecret as jwt.Secret,
      { expiresIn: appConfig.jwtExpiration as jwt.SignOptions['expiresIn'] }
    );

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

  async forgotPassword(data: ForgotPasswordInput) {
    const user = await UserRepository.findByEmail(data.email);

    if (!user) {
      return;
    }

    const token = jwt.sign(
      { id: user.id, purpose: 'reset' },
      appConfig.jwtSecret as jwt.Secret,
      { expiresIn: '15m' }
    );

    return { token };
  }

  async resetPassword(data: ResetPasswordInput) {
    const payload = jwt.verify(
      data.token,
      appConfig.jwtSecret as jwt.Secret
    ) as { id: number; purpose?: string };

    if (!payload?.id || payload?.purpose !== 'reset') {
      throw new UnauthorizedError('Token inválido');
    }

    const user = await UserRepository.findById(payload.id);

    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    const newPasswordHash = await bcrypt.hash(data.password, 10);

    await UserRepository.updatePassword(user.id, newPasswordHash);

    return;
  }
}

export default new AuthService();
