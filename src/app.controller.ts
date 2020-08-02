import { Controller, Get, Res, Request, Param, Req, UseGuards} from '@nestjs/common';
import {AuthenticatedGuard} from './auth/common/authenticate.guard'
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  index(@Res() res) {
    res.render('userLogin', { title: "Post Scheduler" });
  }

  @Get('logout')
  logout(@Res() res, @Req() req){
      req.session = null;  //is this the cleanest way to end a session??
      
      //must include title or will get errors
      res.render('userLogin',{title: "Post Scheduler", exitMessage: true}); //show exit message
      
      
      //probably should use redirect instead of render!
      //redirect restarts the request from scratch... 
      //res.redirect('userLogin',{exitMessage: true}); //show exit message
  }

  @UseGuards(AuthenticatedGuard)
  @Get('userProfile')
  userStart(@Res() res, @Req() req) {
    console.log("INSIDE app/userProfile GET")
    console.log("REQ.SESS: ", req.session);
    res.render('userProfile', { title: "Post Scheduler" });
  }

  @Get(':path')
  retPath(@Param('path') path, @Req() req, @Res() res){

    if(req.session ){
      console.log("Default route path...")
      console.log("serving Session Path: ", path);      
      //console.log(req);     
      console.log(res.locals);  
      console.log("REQ.SESS: ", req.session);
      //res.locals.currentUser = req.session.user    
 

      res.render(path, { title: "New Title: " });
      return;
    }
    else{
      console.log("serving OLD title");
      //console.log("RES: ", res.session);

      res.render(path, { title: "Old title: "+path });
      return;
    }

  }


  getHello(): string {
    return this.appService.getHello();
  }

}
/*
  @Post('/signups')
  async signUps(@Body() body, @Response() res, @Request req){
   //lookup username
   next();

  }

  @Post('/login')
  async login(@Body() body, @Response() res, @Request req){
   //lookup username
   next();

  }
*/