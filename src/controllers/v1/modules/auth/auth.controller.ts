import { Request, Response } from 'express';
import { LoginInput, RegisterInput } from '@/validations/v1/modules/auth.validations';
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
}

export default new AuthController();
