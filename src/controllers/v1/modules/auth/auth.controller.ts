import { Request, Response } from 'express';
import {
  LoginInput,
  RegisterInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from '@/validations/v1/modules/auth.validations';
import AuthService from '@/services/v1/modules/auth/auth.service';
import { UserResource } from '@/resources/v1/modules/user/user.resources';
import { StatusCode } from '@/constants/status-code.constants';
import appConfig from '@/configs/app.config';

export class AuthController {
  login = async (req: Request<{}, {}, LoginInput>, res: Response) => {
    const result = await AuthService.login(req.body);

    res.status(StatusCode.OK).json({
      message: 'Login realizado com sucesso.',
      token: {
        accessToken: result.token,
        expiresIn: appConfig.jwtExpiration,
        tokenType: 'Bearer',
      },
    });
  };

  register = async (req: Request<{}, {}, RegisterInput>, res: Response) => {
    const user = await AuthService.register(req.body);

    res.status(StatusCode.OK).json({
      message: 'Usuário criado com sucesso.',
      user: UserResource.toResponse(user),
    });
  };

  me = async (req: Request, res: Response) => {
    const user = await AuthService.me(req.userId);

    res.status(StatusCode.OK).json({
      message: 'Usuário encontrado com sucesso.',
      user: UserResource.toResponse(user),
    });
  };

  forgotPassword = async (
    req: Request<{}, {}, ForgotPasswordInput>,
    res: Response,
  ) => {
    const result = await AuthService.forgotPassword(req.body);

    res.status(StatusCode.OK).json({
      message: 'Se existir, enviaremos instruções para o email informado.',
      token: result?.token,
    });
  };

  resetPassword = async (
    req: Request<{}, {}, ResetPasswordInput>,
    res: Response,
  ) => {
    await AuthService.resetPassword(req.body);

    res.status(StatusCode.OK).json({
      message: 'Senha redefinida com sucesso.',
    });
  };
}

export default new AuthController();
