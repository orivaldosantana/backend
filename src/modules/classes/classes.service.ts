import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClassMetricsDto } from './dto/get-class-metrics.dto';
import { ClassDto } from './dto/get-class.dto';
import { ListSubjectClassDto } from './dto/get-list-subjects.dto';
import { StudentDto } from './dto/get-students.dto';
import { ClassDocument, TClass } from './schemas/class.schema';
import {
  ClassDifficulty,
  ClassDifficultyDocument,
} from './schemas/classdifficulty.schema';
import { ClassListDocument, ClassList } from './schemas/classlist.schema';
import {
  ClassStudents,
  ClassStudentsDocument,
} from './schemas/classstudents.schema';
import {
  ListSubjectClass,
  ListSubjectClassDocument,
} from './schemas/listsubjectclass.schema';
import { Student, StudentDocument } from './schemas/student.schema';
import {
  TeacherClass,
  TeacherClassDocument,
} from './schemas/teacherclass.schema';

@Injectable({})
export class ClassesService {
  constructor(
    @InjectModel(TClass.name) private readonly classModel: Model<ClassDocument>,
    @InjectModel(TeacherClass.name)
    private readonly teacherClassModel: Model<TeacherClassDocument>,
    @InjectModel(ListSubjectClass.name)
    private readonly listSubjectClass: Model<ListSubjectClassDocument>,
    @InjectModel(ClassList.name)
    private readonly classListModel: Model<ClassListDocument>,
    @InjectModel(ClassDifficulty.name)
    private readonly classDifficultyModel: Model<ClassDifficultyDocument>,
    @InjectModel(ClassStudents.name)
    private readonly classStudentsModel: Model<ClassStudentsDocument>,
    @InjectModel(Student.name)
    private readonly studentModel: Model<StudentDocument>,
  ) {}

  async findTeacherClasses(userEmail: string): Promise<ClassDto[]> {
    const teacherClassData = await this.teacherClassModel
      .findOne({ email: userEmail })
      .exec();
    console.log(teacherClassData);
    if (teacherClassData != null) {
      const classIds = teacherClassData['classes'];

      return this.classModel.find({ class_id: { $in: classIds } }).exec();
    }
    return null;
  }

  async findOne(id: string): Promise<ClassDto> {
    return this.classModel.findOne({ class_id: id }).exec();
  }

  async findListSubjectClass(id: string): Promise<ListSubjectClassDto[]> {
    // Realiza tratamento de exceção
    const data = await this.listSubjectClass.findOne({ class_id: id }).exec();
    if (!data) return [];
    return data['tags'].map((l) => ({
      fullName: l.subject,
      name: l.subject,
      acertos: l.qt_acertos,
      erros: l.qt_erros,
      restantes: l.qt_nao_fez,
    }));
  }

  async findClassLists(id: string): Promise<ClassMetricsDto[]> {
    // Realiza tratamento de exceção
    const data = await this.classListModel.findOne({ class_id: id }).exec();

    if (!data) return [];
    return data.lists.map((l) => ({
      fullName: l.description,
      name: l.description,
      acertos: l.qt_acertos,
      erros: l.qt_erros,
      restantes: l.qt_nao_fez,
    }));
  }

  async findClassDifficulties(id: string): Promise<ClassMetricsDto[]> {
    const data = await this.classDifficultyModel
      .findOne({ class_id: id })
      .exec();
    if (!data) return [];
    return data.difficulty.map((d) => ({
      fullName: d.level,
      name: d.level,
      acertos: d.qt_acertos,
      erros: d.qt_erros,
      restantes: d.qt_nao_fez,
    }));
  }

  async findClassStudents(classId: string): Promise<StudentDto[]> {
    const data = await this.classStudentsModel
      .findOne({ class_id: classId })
      .exec();
    if (!data) return [];
    const arrayStudentIds = data['students'].map((s) => s['student_id']);
    const studentArray = await this.studentModel
      .find({ id: { $in: arrayStudentIds } })
      .exec();
    return studentArray.map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      progress: s.percent,
    }));
  }

  async findClassOverallPerformance(classCode: string) {
    const data = await this.classStudentsModel
      .findOne({ class_code: 'lop2023_2t01' })
      .exec();
    console.log(classCode)
    console.log(data) 
    return data 
  }
}
