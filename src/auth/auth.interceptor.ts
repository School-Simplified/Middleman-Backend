import {
  Injectable,
  ExecutionContext,
  NestInterceptor,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { VolunteerService } from '../volunteers/volunteer.service';
import { AuthService } from './auth.service';
/* 
    Volunteer API routes are restricted solely to authenticated users by proof of a signed JWT.
    This interceptor gives access to the respective user's google tokens in the context of
    the controller and service, after the guard has allowed the request and populated `req.user`.
    Because JWT's are encoded, not encrypted, anyone can decode the body of the JWT and find its data.
    Storing the google token in the database keeps their credentials safe. When the time comes to refresh a user token,
    we should do that automatically here
*/
@Injectable()
export class AuthInteceptor implements NestInterceptor {
  constructor(
    private authService: AuthService,
    private volunteerService: VolunteerService,
  ) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const user = await this.volunteerService.getUserByEmail(
      context.switchToHttp().getRequest().user.email,
    );
    let newToken = user.googleOauthToken;
    if (!(await this.authService.validateToken(user.googleOauthToken))) {
      newToken = await this.authService.refreshGoogleToken(
        user.googleRefreshToken,
      );
    }
    context.switchToHttp().getRequest().user.token = newToken;
    context.switchToHttp().getRequest().user.refresh = user.googleRefreshToken;
    return next.handle();
  }
}
