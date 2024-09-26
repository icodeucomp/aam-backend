import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';

import { GetUser } from '@common/decorators';
import { JwtGuard, JwtRefreshGuard } from '@common/guards';
import { JwtTokens, ResponsePayload } from '@common/interfaces';
import { successResponsePayload } from '@common/utils';
import { LoginDto } from '@modules/authentication/dtos';
import { AuthenticationService } from '@modules/authentication/authentication.service';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginDto): Promise<ResponsePayload<JwtTokens>> {
    const tokens = await this.authenticationService.login(dto);

    return successResponsePayload('Admin login', tokens);
  }

  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  @Post('logout')
  async logout(@GetUser('id') adminId: number): Promise<any> {
    const admin = await this.authenticationService.logout(adminId);

    return successResponsePayload('Admin logout', admin);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  @Post('refresh-token')
  async refreshTokens(
    @GetUser('sub') adminId: number,
    @GetUser('refreshToken') refreshToken: string,
  ) {
    const updatedRefreshToken = await this.authenticationService.refreshTokens(
      adminId,
      refreshToken,
    );

    return successResponsePayload('Admin logout', updatedRefreshToken);
  }
}
