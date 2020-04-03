import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthCreditalsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(
    @Body(ValidationPipe) authCreditalsDto: AuthCreditalsDto,
  ): Promise<void> {
    return this.authService.signUp(authCreditalsDto);
  }

  @Post('/signin')
  signIn(
    @Body() authCreditalsDto: AuthCreditalsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCreditalsDto);
  }
}
