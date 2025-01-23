import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/enums/role.enums';

// Define a chave usada para armazenar roles na metadata
export const ROLES_KEY = 'roles';

// Decorador personalizado para associar roles a uma rota
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
