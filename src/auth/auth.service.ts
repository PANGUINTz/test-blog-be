import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { SignInDto } from './dtos/auth.dto';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) {}

  async signUp(user: Partial<User>, slug: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      const hashedPassword = await argon2.hash(user?.password);

      const usernameExist = await this.userRepository.findOneBy({
        username: user.username,
      });

      if (usernameExist) {
        return {
          statusCode: 400,
          success: false,
          message: 'username is already exists',
        };
      }

      const data = {
        ...user,
        password: hashedPassword,
        slug: slug,
      };
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const newUser = this.userRepository.create(data);
      await queryRunner.commitTransaction();
      return {
        statusCode: 201,
        success: true,
        message: 'created success',
        data: await this.userRepository.save(newUser),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return {
        statusCode: 500,
        success: false,
        message: error.message,
      };
    }
  }

  async signIn(user: SignInDto) {
    const result = await this.userRepository.findOneBy({
      username: user.username,
    });
    if (!result) {
      return {
        statusCode: 401,
        success: false,
        message: 'Invalid username',
      };
    }

    const matchPassword = await argon2.verify(result?.password, user?.password);
    if (!matchPassword) {
      return {
        statusCode: 401,
        success: false,
        message: 'Invalid password',
      };
    }

    const jwtPayload = {
      sub: result.id,
      user: result,
    };

    const accessToken = await this.jwtService.signAsync(jwtPayload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: '10h',
      algorithm: 'HS256',
    });

    return {
      statusCode: 201,
      success: true,
      type: 'Bearer',
      access_token: accessToken,
    };
  }

  async getProfile(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      return {
        status: 404,
        success: false,
        message: 'Invalid user',
        data: user,
      };
    }
    return {
      status: 200,
      success: true,
      message: 'success',
      data: user,
    };
  }
}
