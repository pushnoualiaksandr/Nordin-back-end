import { CreationAttributes, DestroyOptions, FindOptions, UpdateOptions } from 'sequelize';
import { Model } from 'sequelize-typescript';
import { Attributes, CountOptions, FindAndCountOptions } from 'sequelize/types/model';

import { BaseQuery } from '../dto/BaseQuery';
import { PaginatedResponseDto } from '../dto/paginated-response.dto';

export interface IRepository<M extends Model> {
    create(model: CreationAttributes<M>): Promise<M>;

    update(criteria: UpdateOptions<M>, model: Partial<M>): Promise<[affectedCount: number, affectedRows: M[]]>;

    findById(id: string | number): Promise<M>;

    findOneByOptions(options: FindOptions<M>): Promise<M>;

    findAllByOptions(options: FindOptions<M>): Promise<M[]>;

    delete(criteria: DestroyOptions<M>): Promise<number>;

    bulkCreate(models: CreationAttributes<M>[]): Promise<M[]>;

    findAllPaginated(
        query: BaseQuery,
        options?: Omit<FindAndCountOptions<Attributes<M>>, 'group'>,
    ): Promise<PaginatedResponseDto<M>>;

    count(options?: Omit<CountOptions<Attributes<M>>, 'group'>): Promise<number>;
}
