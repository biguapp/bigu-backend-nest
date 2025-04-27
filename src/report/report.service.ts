import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report } from './interfaces/report.interface';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { UserService } from '@src/user/user.service';
import { MailjetService } from 'nest-mailjet';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel('Report') private readonly reportModel: Model<Report>,
    private readonly userService: UserService,
    private readonly mailjetService: MailjetService,
  ) {}

  async create(
    createReportDto: CreateReportDto,
    reporterId: string,
  ): Promise<Report> {
    const { accusedId, content, comment } = createReportDto;
    const reporterName = (await this.userService.findOne(reporterId)).name;
    const reporterSex = (await this.userService.findOne(reporterId)).sex;
    const accusedName = (await this.userService.findOne(accusedId)).name;
    const newReport = {
      ...createReportDto,
      reporterId,
      reporterName,
      reporterSex,
    };
    const report = new this.reportModel(newReport);
    await this.userService.addReportToUser(accusedId, report._id.toString());

    // envia email para o suporte da Bigu ficar ciente da denúncia e tomar as medidas cabiveis
    await this.sendEmail(
      'biguapp@hotmail.com',
      `[BIGUAPP] ⚠️ Nova denúncia registrada por ${reporterName}!`,
      `<strong>Denunciante:</strong> ${reporterName} (ID: ${reporterId})<br><br>` +
        `<strong>Usuário acusado:</strong> ${accusedName} (ID: ${accusedId})<br><br>` +
        `<strong>Motivo da denúncia:</strong> ${content}<br><br>` +
        `<strong>Comentários adicionais:</strong><br>${comment}`,
    );

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

  async removeReport(id: string): Promise<Report> {
    const report = await this.reportModel.findByIdAndDelete(id).exec();
    if (!report) {
      throw new NotFoundException(`Denúncia com ID ${id} não encontrada.`);
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

  private async sendEmail(
    emails: string | string[],
    subject: string,
    text: string,
  ): Promise<string> {
    const recipients = Array.isArray(emails) // Se apenas um email for fornecido, transforma-o em uma lista
      ? emails.map((email) => ({ Email: email })) // Mapeia para o formato esperado pelo Mailjet
      : [{ Email: emails }];
    const repl = await this.mailjetService.send({
      Messages: [
        {
          From: {
            Email: process.env.MAILJET_SENDER_EMAIL,
          },
          To: recipients,
          Subject: subject,
          TextPart: text,
        },
      ],
    });

    return repl.body.Messages[0].Status;
  }
}
