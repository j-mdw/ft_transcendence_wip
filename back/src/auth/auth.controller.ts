import { Controller, Get, Post, HttpException, Redirect, Res, Req, Body, Param, HttpStatus, UseGuards, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RelationId } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { read } from 'fs';
import { UsersService } from 'src/user/user.service';

@Controller()
export class AuthController {
  constructor(private readonly appService: AuthService,
    private jwtService: JwtService,
    private usersService: UsersService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res({passthrough: true}) response: Response) {
    ///const data = this.appService.googleLogin(req)
    const data = await this.appService.addingUser(req)

    const payload = { userId: data.user.id};
    const token = this.jwtService.sign(payload);

    response
      .cookie('access_token', token, {
        httpOnly: true
      })

    return {data}

  }

  @Get('42')
  @UseGuards(AuthGuard('42'))
  async school42Auth(@Req() req) {}

  @Get('42/redirect')
  @UseGuards(AuthGuard('42'))
  async school42AuthRedirect(@Req() req, @Res({passthrough: true}) response: Response) {
    const data = await this.appService.addingUser(req)

    const payload = { userId: data.user.id};
    const token = this.jwtService.sign(payload);
    console.log("TOKEN");
    response.cookie('access_token', token, {
        httpOnly: true
      })

    return {data}
  }

  @Get('test')
  test(@Res({passthrough: true}) res: Response) {
    const payload = { userId: 1};
    const token = this.jwtService.sign(payload);
    console.log("TOKEN");
    res.cookie('access_token', token, {
        httpOnly: true
      })
  }

  @Post('login')
  login(@Res() response: Response) {
    // Do username+password check here.

    const userId = 'dummy';

    const payload = { userId: userId };
    const token = this.jwtService.sign(payload);

    response
      .cookie('access_token', token, {
        httpOnly: true,
        domain: 'localhost', // your domain here!
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      })
      .send({ success: true });
  }

  @Post('pseudo')
  @UseGuards(AuthGuard('jwt'))
  async uppdateUser(@Param('id') id: string, @Req() req) {
    await this.usersService.update_pseudo(id, req.body.pseudo);
    return {
      statusCode: HttpStatus.OK,
      message: 'User updated successfully',
    };
}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  tests(@Req() req,): string {
    // req.
    console.log();
    return req.user
  }

  @Get('me/psuedo')
  @UseGuards(AuthGuard('jwt'))
  pseudo(@Req() req,): string {
    // req.
    console.log(req.user.pseudo);
    return req.user.pseudo
  }



}