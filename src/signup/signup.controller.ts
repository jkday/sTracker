import { Controller } from '@nestjs/common';
import { Get, Res, Request, Param } from '@nestjs/common';


@Controller('signup')
export class SignupController {

    @Get()
        async getSignUpPage( @Res() res) {
            res.render('signup', {});
         }

}
