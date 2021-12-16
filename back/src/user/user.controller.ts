import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Res,
  HttpStatus,
  ParseUUIDPipe,
  UseGuards,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './user.dto';
import { Response } from 'express';
import { JwtGuard } from 'src/auth/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('user')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private userService: UserService) {}
  @Get()
  findAll(): Promise<UserDTO[]> {
    return this.userService.getUsers();
  }

  @Get('me')
  async findMe(
    @Res({ passthrough: true }) response: Response,
  ): Promise<UserDTO> {
    // try {
      return await this.userService.findById(response.locals.id);
    // } catch {
      // throw new BadRequestException();
    // }
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<UserDTO> {
    return this.userService.findById(id);
  }

  @Patch()
  async updateUser(
    @Res({ passthrough: true }) response: Response,
    @Body() data: Partial<Omit<UserDTO, 'id'>>,
  ) {
    console.log('Paths - user id:', response.locals.id);
    await this.userService.update(response.locals.id, data);
    // return {
    //   statusCode: HttpStatus.OK,
    //   message: 'User updated successfully',
    // };
  }

  @Delete()
  deleteAccount(@Res({ passthrough: true }) response: Response) {
    return this.userService.delete(response.locals.id);
  }

  @Delete('delete/avatar')
  async beforeUpload(@Res({ passthrough: true }) response: Response) {
    const user = await this.userService.findById(response.locals.id);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('fs');

    if (fs.existsSync(user.avatarPath)) {
      try {
        fs.unlinkSync(user.avatarPath);
        console.log('Successfully deleted the file');
      } catch (err) {
        throw err;
      }
    }
  }

  @Post('upload/avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './avatars',
        filename: function (req, file, cb) {
          const new_name = req.res.locals.id;
          const extArray = file.mimetype.split('/');
          const extension = extArray[extArray.length - 1];
          cb(null, new_name + '.' + extension);
        },
      }),
    }),
  )
  async uploadFile(
    @Res({ passthrough: true }) response: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.userService.update_avatar(response.locals.id, file.path);
  }

  @Get('me/avatar') //Probably don't need this anymore
  async seeUploadedFile(@Res() res) {
    const data = await this.userService.findById(res.locals.id);
    return res.sendFile(data.avatarPath, { root: './' });
  }
}
