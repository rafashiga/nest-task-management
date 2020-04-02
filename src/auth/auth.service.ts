import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthCreditalsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {}

  async signUp(authCreditalsDto: AuthCreditalsDto): Promise<void> {
    return await this.userRepository.signUp(authCreditalsDto);
  }

  async signIn(authCreditalsDto: AuthCreditalsDto) {
    const username = await this.userRepository.validateUserPassword(
      authCreditalsDto,
    );

    if (!username) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
