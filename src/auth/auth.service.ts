import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private databaseService: DatabaseService,
    private jwtService: JwtService,
  ) {}
  async signup(signupData: SignupDto) {
    const { email, password, username } = signupData;
    //Check if name is used

    const emailInUse = await this.databaseService.user.findUnique({
      where: { email: email },
    });
    if (emailInUse) {
      throw new ConflictException('Email is already used');
    }

    //Check if username is used

    const usernameInUse = await this.databaseService.user.findUnique({
      where: { username: username },
    });
    if (usernameInUse) {
      throw new ConflictException('Username is already used');
    }

    //Hash password and save to database
    const hashedPassword = await bcrypt.hash(password, 10);

    //Create user document and save it in postgres

    await this.databaseService.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
  }
  async login(loginData: LoginDto) {
    const { email, password } = loginData;
    //Check if user with given email exists
    const user = await this.databaseService.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new UnauthorizedException('Wrong email or password');
    }
    //Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Wrong email or password');
    }
    const tokens = await this.generateUserToken(user.id);
    return {
      ...tokens,
      userId: user.id,
    };
  }

  async refreshTokens(refreshToken: string) {
    const token = await this.databaseService.refreshToken.findFirst({
      where: { token: refreshToken },
    });
    if (!token) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const currentDate = new Date();
    if (token.expiryDate < currentDate) {
      throw new UnauthorizedException('Refresh token has expired');
    }
    await this.databaseService.refreshToken.delete({
      where: { id: token.id },
    });
    return this.generateUserToken(token.userId);
  }

  async generateUserToken(userId: string) {
    const accessToken = this.jwtService.sign({ userId }, { expiresIn: '1h' });
    const refreshToken: string = uuidv4();

    await this.storeRefershToken(refreshToken, userId);
    return { accessToken, refreshToken };
  }

  async storeRefershToken(token: string, userId: string) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);
    await this.databaseService.refreshToken.create({
      data: {
        token,
        expiryDate,
        userId,
      },
    });
  }
}
