import {
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectModel } from '@nestjs/mongoose';
  import { Model } from 'mongoose';
  import { Report } from './interfaces/report.interface';
  import { CreateReportDto } from './dto/create-report.dto';
  import { UpdateReportDto } from './dto/update-report.dto';
  import { Ride } from '@src/ride/interfaces/ride.interface';
  import { UserService } from '@src/user/user.service';
  import { RideService } from '@src/ride/ride.service';
  
  @Injectable()
  export class ReportService {
    constructor(
      @InjectModel('Report') private readonly reportModel: Model<Report>,
      @InjectModel('Ride') private readonly rideModel: Model<Ride>,
      private readonly userService: UserService,
      private readonly rideService: RideService,
    ) {}
  
    async create(
      createReportDto: CreateReportDto,
      reporterId: string,
    ): Promise<Report> {
      const reporterName = (await this.userService.findOne(reporterId)).name;
      const newReport = { ...createReportDto, reporterId, reporterName };
      const report = new this.reportModel(newReport);
      const { rideId } = createReportDto;
      await this.rideService.addReportToRide(rideId, report._id.toString(), {
        reporterId
      });
      return await report.save();
    }
  
    async addMemberReport(
      createReportDto: CreateReportDto,
      reporterId: string,
    ): Promise<Report> {
      const reporterName = (await this.userService.findOne(reporterId)).name;
      const newReport = { ...createReportDto, reporterId, reporterName };
      const report = new this.reportModel(newReport);
      return await report.save();
    }
  
    async getUserReports(userId: string): Promise<Report[]> {
      if (!this.userService.findOne(userId)) {
        throw new NotFoundException(`Usuário com ID ${userId} não encontrado.`);
      }
      return await this.reportModel.find({ accusedId: userId }).exec();
    }
  
    async updateDriverReport(
      reportId: string,
      updateReportDto: UpdateReportDto,
    ): Promise<Report> {
      const report = await this.reportModel
        .findByIdAndUpdate(reportId, updateReportDto, { new: true })
        .exec();
      if (!report) {
        throw new NotFoundException(
          `Denúncia de motorista com ID ${reportId} não encontrada.`,
        );
      }
      return report;
    }
  
    async updateMemberReport(
      reportId: string,
      updateReportDto: UpdateReportDto,
    ): Promise<Report> {
      const report = await this.reportModel
        .findByIdAndUpdate(reportId, updateReportDto, { new: true })
        .exec();
      if (!report) {
        throw new NotFoundException(
          `Denúncia de membro com ID ${reportId} não encontrada.`,
        );
      }
      return report;
    }
  
    async removeDriverReport(reportId: string): Promise<Report> {
      const report = await this.reportModel.findByIdAndDelete(reportId).exec();
      if (!report) {
        throw new NotFoundException(
          `Denúncia de motorista com ID ${reportId} não encontrada.`,
        );
      }
      return report;
    }
  
    async removeMemberReport(reportId: string): Promise<Report> {
      const report = await this.reportModel.findByIdAndDelete(reportId).exec();
      if (!report) {
        throw new NotFoundException(
          `Denúncia de membro com ID ${reportId} não encontrada.`,
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
  