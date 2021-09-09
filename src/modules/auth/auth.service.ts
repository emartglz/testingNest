import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcryptjs';
import { JwtPayload } from 'jsonwebtoken';
import { RoleType } from '../role/roletype.enum';
import { User } from '../user/user.entity';
import { AuthRepository } from './auth.repository';
import { SigninDto, SignupDto } from './dto';
import { IJwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthRepository)
    private readonly _authRepository: AuthRepository,
    private readonly _jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto): Promise<void> {
    const { username, email } = signupDto;
    const userExist = await this._authRepository.findOne({
      where: [
        {
          username,
        },
        {
          email,
        },
      ],
    });

    if (userExist) {
      throw new ConflictException('username or email already exist');
    }
    return this._authRepository.signup(signupDto);
  }

  async signin(signinDto: SigninDto): Promise<{ token: string }> {
    const { username, password } = signinDto;
    const user: User = await this._authRepository.findOne({
      where: {
        username,
      },
    });

    if (!user) {
      throw new NotFoundException('user does not exist');
    }

    const isMacth = await compare(password, user.password);
    if (!isMacth) {
      throw new UnauthorizedException('invalid credentials');
    }

    const payload: IJwtPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
      roles: user.roles.map((r) => r.name as RoleType),
    };

    const token = await this._jwtService.sign(payload);
    return { token };
  }
}
