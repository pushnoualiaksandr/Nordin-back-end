import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Transaction, WhereOptions } from 'sequelize';
import { SchedulerRegistry } from '@nestjs/schedule';
import { VerifyRepository } from '@/modules/auth/repository/verify.repository';
import { Milliseconds } from '@/utils/data/enums/Milliseconds';
import { Verification } from '@/core/models';
import { AuthExceptions } from '@/core/exception';

@Injectable()
export class VerifyService {
    private readonly logger = new Logger(VerifyService.name);

    constructor(
        private readonly verifyRepository: VerifyRepository,
        private readonly schedulerRegistry: SchedulerRegistry,
    ) {}

    async createOrUpdate(authField: string, time: number, code: string): Promise<Verification> {
        let record = await this.findVerification(authField);

        if (record) {
            record.lastRequestTime = time;
            record.code = code;
            record.isValidate = false;
            return record.save({ fields: ['lastRequestTime', 'code'] });
        }

        record = await this.verifyRepository.create({ authField, code, lastRequestTime: time,isValidate: false  });
        this.deleteCodeAfter15Minutes(record.id);

        return record;
    }

    async deleteByAuthField(authField: string, transaction?: Transaction): Promise<number> {
        const where: WhereOptions<Verification> = {
            authField,
        };

        return await this.verifyRepository.delete({ where ,transaction});
    }

    async findVerification(authField: string): Promise<Verification | null> {
        const where: WhereOptions<Verification> = {
            authField,
        };

        return  await this.verifyRepository.findOneByOptions({
            where,
        });

    }

    async verifyAndConfirmCode(phone: string, code: string): Promise<void> {
        const record = await this.findVerification(phone);

        if (!record) {
            throw new NotFoundException(AuthExceptions.VERIFICATION_NOT_FOUND);
        }

        if (record.code !== code) {
            throw new BadRequestException(AuthExceptions.CODE_NOT_CORRECT);
        }


        const now = Date.now();
        const codeAge = now - record.lastRequestTime;

        if (codeAge > Milliseconds.FIFTEEN_MINUTES) {
            await this.deleteByAuthField(phone);
            throw new BadRequestException(AuthExceptions.CODE_EXPIRED);
        }

        record.isValidate = true;
        await record.save({ fields: ['isValidate'] });


        this.clearDeleteTimeout(record.id);
    }

    async verifyLastRequestTime(authField: string): Promise<Verification> {
        const record = await this.findVerification(authField);

        if (!record) {
          return
        }

        const now = new Date().getTime();

        if (now - record.lastRequestTime < 60000) {
            throw new BadRequestException(AuthExceptions.SMS_WAIT);
        }
        return  record
    }



    async validateVerification(phone: string): Promise<void> {
        const verifyData = await this.findVerification(phone);
        console.log('veri=>', phone);
        if (!verifyData) {
            throw new NotFoundException(AuthExceptions.VERIFICATION_NOT_FOUND);
        }
        if (!verifyData.isValidate) {
            throw new BadRequestException(AuthExceptions.USER_NOT_VERIFY);
        }
    }

    private clearDeleteTimeout(recordId: number): void {
        try {
            const timeoutName = `delete-verification-${recordId}`;
            this.schedulerRegistry.deleteTimeout(timeoutName);
            this.logger.log(`Cleared delete timeout for verification ${recordId}`);
        } catch (error) {
             this.logger.debug(`No delete timeout found for verification ${recordId}`);
        }
    }

    private deleteCodeAfter15Minutes(recordId: number): void {
        const callback = () => {
            this.logger.log({ recordId }, `Delete record after 15 minutes`);
            void this.verifyRepository.delete({ where: { id: recordId } });
        };

        const timeout = setTimeout(callback, Milliseconds.FIFTEEN_MINUTES);
        this.schedulerRegistry.addTimeout(`delete-code-${recordId}_${Date.now()}`, timeout);
    }


}
