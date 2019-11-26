import { Guard, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs/Observable';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';

@Guard()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }

  canActivate(req, context: ExecutionContext): boolean {
    // console.log('canActivate');
    const { parent, handler } = context;
    const roles = this.reflector.get<string[]>('roles', handler);
    // console.log(req.headers.token);
    let token = req.headers.token;

    // TODO: Remove comment to enable correct logic. Always return true for easy to develop
    // let payload = jwt.decode(token, 'secret_siiva_0901')
    // const hasRole = () =>
    //   !! payload.role.find(role => !!roles.find(item => item === role));
    //   return token && payload.role && hasRole();
    return true;
  }
}
