import {
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectModel } from '@nestjs/mongoose';
  import { Model } from 'mongoose';
  import { Report } from './interfaces/report.interface';
  import { CreateReportDto } from './dto/create-report.dto';
  import { UpdateReportDto } from './dto/update-report.dto';
  import { UserService } from '@src/user/user.service';
  
  @Injectable()
  export class ReportService {
    constructor(
      @InjectModel('Report') private readonly reportModel: Model<Report>,
      private readonly userService: UserService,
    ) {}
  
    async create(
      createReportDto: CreateReportDto,
      reporterId: string,
    ): Promise<Report> {
      const reporterName = (await this.userService.findOne(reporterId)).name;
      const newReport = { ...createReportDto, reporterId, reporterName };
      const report = new this.reportModel(newReport);
      const { accusedId } = createReportDto;
      await this.userService.addReportToUser(accusedId, report._id.toString());
      return await report.save();
    }
  
    async getReceivedReports(userId: string): Promise<Report[]> {
      if (!this.userService.findOne(userId)) {
        throw new NotFoundException(`Usuário com ID ${userId} não encontrado.`);
      }
      return await this.reportModel.find({ accusedId: userId }).exec();
    }

    async getSubmittedReports(userId: string): Promise<Report[]> {
      if (!this.userService.findOne(userId)) {
        throw new NotFoundException(`Usuário com ID ${userId} não encontrado.`);
      }
      return await this.reportModel.find({ reporterId: userId }).exec();
    }
  
    async update(
      updateReportDto: UpdateReportDto,
      reportId: string,
    ): Promise<Report> {
      const report = await this.reportModel
        .findByIdAndUpdate(reportId, updateReportDto, { new: true })
        .exec();
      if (!report) {
        throw new NotFoundException(
          `Denúncia com ID ${reportId} não encontrada.`,
        );
      }
      return report;
    }
  
    async removeReport(reportId: string): Promise<Report> {
      const report = await this.reportModel.findByIdAndDelete(reportId).exec();
      if (!report) {
        throw new NotFoundException(
          `Denúncia com ID ${reportId} não encontrada.`,
        );
      }
      return report;
    }
  
    async findOne(id: string): Promise<Report> {
      const report = await this.reportModel.findById(id).exec();
      if (!report) {
        throw new NotFoundException(`Denúncia com ID ${id} não encontrada.`);
      }
      return report;
    }
  
    async findAll(): Promise<Report[]> {
      return await this.reportModel.find().exec();
    }
  
    async removeAll(): Promise<void> {
      await this.reportModel.deleteMany().exec();
    }
  }
  