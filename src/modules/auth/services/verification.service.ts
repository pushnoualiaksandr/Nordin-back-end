import { Injectable, Logger } from '@nestjs/common';
import { Transaction, WhereOptions } from 'sequelize';
import { SchedulerRegistry } from '@nestjs/schedule';
import { VerifyRepository } from '@/modules/auth/repository/verify.repository';
import { Milliseconds } from '@/utils/data/enums/Milliseconds';
import { Verification } from '@/core/models';

@Injectable()
export class VerifyService {
    private readonly logger = new Logger(VerifyService.name);

    constructor(
        private readonly verifyRepository: VerifyRepository,
        private readonly schedulerRegistry: SchedulerRegistry,
    ) {}

    async createOrUpdate(authField: string, time: number, cipher: string, code: string): Promise<Verification> {
        let record = await this.findVerification(authField);

        if (record) {
            record.lastRequestTime = time;
            record.cipher = cipher;
            record.code = code;
            return record.save({ fields: ['lastRequestTime', 'cipher', 'code'] });
        }

        record = await this.verifyRepository.create({ authField, cipher, lastRequestTime: time , code});
        this.deleteCodeAfter15Minutes(record.id);

        return record;
    }

    async deleteByAuthField(authField: string, transaction?: Transaction): Promise<number> {
        const where: WhereOptions<Verification> = {
            authField,
        };

        return await this.verifyRepository.delete({ where ,transaction});
    }

    async findVerification(authField: string, transaction?: Transaction): Promise<Verification | null> {
        const where: WhereOptions<Verification> = {
            authField,
        };

      return   await this.verifyRepository.findOneByOptions({
            where,
          transaction
        }, );
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