import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { RequestWithUser } from 'src/types/Requests';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('classes')
export class ClassesController {
  constructor(private classesService: ClassesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findTeacherClasses(@Request() req: RequestWithUser) {
    return this.classesService.findTeacherClasses(req.user.userEmail);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.classesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('listsubject/:id')
  findListSubject(@Param('id') id: string) {
    return this.classesService.findListSubjectClass(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('lists/:id')
  findLists(@Param('id') id: string) {
    return this.classesService.findClassLists(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('difficulties/:id')
  findDifficulties(@Param('id') id: string) {
    return this.classesService.findClassDifficulties(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('students/:id')
  findStudents(@Param('id') id: string) {
    return this.classesService.findClassStudents(id);
  }

  @Get('overallperformance/:class_code')
  findStudentsOverallPerformance(@Param('class_code') code:string) {

    return this.classesService.findClassOverallPerformance(code);
  }
}
