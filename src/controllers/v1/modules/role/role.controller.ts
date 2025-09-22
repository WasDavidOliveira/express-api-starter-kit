import { Request, Response } from 'express';
import RoleService from '@/services/v1/modules/role/role.service';
import { StatusCode } from '@/constants/http';
import { CreateRoleInput } from '@/validations/v1/modules/role.validations';
import { RoleResource } from '@/resources/v1/modules/role/role.resource';

export class RoleController {
  create = async (req: Request<{}, {}, CreateRoleInput>, res: Response) => {
    const roleData: CreateRoleInput = req.body;

    const role = await RoleService.create(roleData);

    res.status(StatusCode.CREATED).json({
      message: 'Role criada com sucesso.',
      data: RoleResource.toResponse(role),
    });
  };

  show = async (req: Request, res: Response) => {
    const { id } = req.params;

    const role = await RoleService.show(Number(id));

    res.status(StatusCode.OK).json({
      message: 'Role encontrada com sucesso.',
      data: RoleResource.toResponse(role),
    });
  };

  update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const roleData: CreateRoleInput = req.body;

    const role = await RoleService.update(Number(id), roleData);

    res.status(StatusCode.OK).json({
      message: 'Role atualizada com sucesso.',
      data: RoleResource.toResponse(role),
    });
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.params;

    await RoleService.delete(Number(id));

    res.status(StatusCode.OK).json({
      message: 'Role deletada com sucesso.',
    });
  };

  index = async (req: Request, res: Response) => {
    const roles = await RoleService.findAll();

    res.status(StatusCode.OK).json({
      message: 'Roles listadas com sucesso.',
      data: RoleResource.collectionToResponse(roles),
    });
  };
}

export default new RoleController();
