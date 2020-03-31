import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';
import { AuthCreditalsDto } from './dto/auth-credentials.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCreditalsDto: AuthCreditalsDto): Promise<void> {
    const { username, password } = authCreditalsDto;

    const user = new User();
    user.username = username;
    user.password = password;

    await user.save();
  }
}
