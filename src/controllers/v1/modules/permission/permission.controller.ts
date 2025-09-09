import { Request, Response } from 'express';
import PermissionService from '@/services/v1/modules/permission/permission.service';
import { StatusCode } from '@/constants/status-code.constants';
import { CreatePermissionInput } from '@/validations/v1/modules/permission.validations';
import { PermissionResource } from '@/resources/v1/modules/permission/permission.resource';

export class PermissionController {
  create = async (req: Request<{}, {}, CreatePermissionInput>, res: Response) => {
    const permissionData: CreatePermissionInput = req.body;

    const permission = await PermissionService.create(permissionData);

    res.status(StatusCode.CREATED).json({
      message: 'Permissão criada com sucesso.',
      data: PermissionResource.toResponse(permission),
    });
  };

  show = async (req: Request, res: Response) => {
    const { id } = req.params;

    const permission = await PermissionService.show(Number(id));

    res.status(StatusCode.OK).json({
      message: 'Permissão encontrada com sucesso.',
      data: PermissionResource.toResponse(permission),
    });
  };

  update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const permissionData: CreatePermissionInput = req.body;

    const permission = await PermissionService.update(
      Number(id),
      permissionData
    );

    res.status(StatusCode.OK).json({
      message: 'Permissão atualizada com sucesso.',
      data: PermissionResource.toResponse(permission),
    });
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.params;

    await PermissionService.delete(Number(id));

    res.status(StatusCode.OK).json({
      message: 'Permissão deletada com sucesso.',
    });
  };
}

export default new PermissionController();
