import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { SignInDto, SignUpDto } from './dtos/auth.dto';
import { AuthService } from './auth.service';
import { StringService } from '../common/utils/string.service';
import { JwtGuard } from './guards/jwt.guard';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly stringService: StringService,
  ) {}

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    const slug = this.stringService.generateRandomString(10);
    return this.authService.signUp(signUpDto, slug);
  }

  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @UseGuards(JwtGuard)
  @Get('info')
  async Info(@Req() req: Request) {
    const userData = req['user'];
    const user = await this.userService.findBySlug(userData.slug);
    return this.authService.getProfile(user.data.id);
  }
}
