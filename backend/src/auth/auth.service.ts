import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { User } from "src/users/entities/user.entity";
import { UsersService } from "src/users/users.service";
import * as bcrypt from "bcryptjs";
import { AppException } from "src/exceptions/app.exception";
import { AuthCodes } from "./contracts/auth.codes";
import { createResponse } from "src/common/response";

type ResponseUser = {
  id: number;
  email: string;
  banned: boolean;
  roles: any;
};

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  private getUserData(user: User): ResponseUser {
    return {
      id: user.id,
      email: user.email,
      banned: user.banned,
      roles: user.roles,
    };
  }

  private async generateTokens(user: User) {
    const payload = this.getUserData(user);

    return {
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.ACCESS_SECRET,
        expiresIn: "1h",
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: process.env.REFRESH_SECRET,
        expiresIn: "7d",
      }),
    };
  }

  private async updateRefreshToken(user: User) {
    const tokens = await this.generateTokens(user);
    const hashRefreshToken = await bcrypt.hash(tokens.refreshToken, 5);
    await this.usersService.update(user.id, { refreshToken: hashRefreshToken });

    return tokens;
  }

  async registration(userDto: CreateUserDto) {
    const candidate = await this.usersService.findOneByEmail(userDto.email);
    if (candidate) {
      throw new AppException({
        status: HttpStatus.BAD_REQUEST,
        code: AuthCodes.USER_ALREADY_EXISTS,
      });
    }

    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const { data: user } = await this.usersService.create({
      ...userDto,
      password: hashPassword,
    });

    const tokens = await this.updateRefreshToken(user);

    const result = createResponse<{ user: ResponseUser; accessToken: string }>()
      .success(AuthCodes.REGISTRATION_SUCCESS)
      .data({
        user: this.getUserData(user),
        accessToken: tokens.accessToken,
      })
      .build();

    this.logger.log(`Регистрация в системе: `, result);

    return result;
  }

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.usersService.findOneByEmail(userDto.email);
    if (!user) {
      throw AppException.unauthorized(AuthCodes.INVALID_CREDENTIALS);
    }

    const passwordEquals = await bcrypt.compare(userDto.password, user.password);
    if (user && passwordEquals) {
      return user;
    }
    throw AppException.unauthorized(AuthCodes.INVALID_CREDENTIALS);
  }

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);

    const tokens = await this.updateRefreshToken(user);

    const result = createResponse<{
      user: ResponseUser;
      accessToken: string;
      refreshToken: string;
    }>()
      .success(AuthCodes.REGISTRATION_SUCCESS)
      .data({
        user: this.getUserData(user),
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      })
      .build();

    this.logger.log(`Вход в систему: `, result);

    return result;
  }

  async logout(userId: number) {
    const { data: user } = await this.usersService.findOne(userId);
    await this.usersService.update(userId, { refreshToken: null });

    this.logger.log(`Выход из системы: `, { id: user.id, email: user.email });
    return true;
  }

  async refresh(refreshToken: string) {
    console.log("refreshToken", refreshToken);

    if (!refreshToken) {
      throw AppException.unauthorized(AuthCodes.REFRESH_TOKEN_MISSING);
    }

    let userData: any;

    try {
      userData = this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_SECRET,
      });
    } catch (e) {
      throw AppException.unauthorized(AuthCodes.REFRESH_TOKEN_INVALID);
    }

    const { data: user } = await this.usersService.findOne(userData.id);

    const refreshTokenEquals = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!user || !refreshTokenEquals) {
      throw AppException.unauthorized(AuthCodes.REFRESH_TOKEN_INVALID);
    }

    const tokens = await this.updateRefreshToken(user);

    const result = createResponse<{
      user: ResponseUser;
      accessToken: string;
      refreshToken: string;
    }>()
      .success(AuthCodes.REGISTRATION_SUCCESS)
      .data({
        user: this.getUserData(user),
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      })
      .build();

    this.logger.log(`Refresh запрос: `, result);

    return result;
  }
}
