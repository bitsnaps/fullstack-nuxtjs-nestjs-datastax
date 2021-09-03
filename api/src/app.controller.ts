import { Param, Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {

  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @Get('members')
  getMembers() {
    return this.appService.getMembers();
  }

  @Get('members/:name')
  getMember(@Param('name') name) {
    return this.appService.getMember(name);
  }

  @Post('members')
  postMembers(@Body() member: any) {
    return this.appService.postMember(member);
  }

}
