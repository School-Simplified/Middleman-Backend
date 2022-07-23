import {
  Injectable,
  ExecutionContext,
  NestInterceptor,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { VolunteerService } from '../volunteers/volunteer.service';
/* 
    Volunteer API routes are restricted solely to authenticated users by proof of a signed JWT.
    This interceptor gives access to the respective user's google tokens in the context of
    the controller and service, after the guard has allowed the request and populated `req.user`.
    Because JWT's are encoded, not encrypted, anyone can decode the body of the JWT and find its data.
    Storing the google token in the database keeps their credentials safe.
*/
@Injectable()
export class AuthInteceptor implements NestInterceptor {
  constructor(private volunteerService: VolunteerService) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    console.log('In interceptor');
    const user = await this.volunteerService.getUserByEmail(
      context.switchToHttp().getRequest().user.email,
    );
    context.switchToHttp().getRequest().user.token = user.googleOauthToken;
    context.switchToHttp().getRequest().user.refresh = user.googleRefreshToken;
    return next.handle();
  }
}
