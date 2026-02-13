import { DestroyOptions, UpdateOptions } from 'sequelize';
import { Model, ModelCtor } from 'sequelize-typescript';
import {
    Attributes,
    BulkCreateOptions,
    CountOptions,
    CreateOptions,
    CreationAttributes,
    FindAndCountOptions,
    FindOptions,
} from 'sequelize/types/model';
import { Col, Fn, Literal } from 'sequelize/types/utils';
import { SetRequired } from 'sequelize/types/utils/set-required';

import { BaseQuery } from '@/utils/data/dto/BaseQuery';
import { PaginatedResponseDto } from '@/utils/data/dto/paginated-response.dto';
import { IRepository } from '@/utils/data/interfaces/IRepository';

type TPagination = {
    page: number;
    limit: number;
    offset: number;
    order: string;
    asc: string;
};

type TUpdateResponse<M extends Model> = Promise<[affectedCount: number, affectedRows: M[]]>;
type TUpdateData<M extends Model> =
    | {
          [key in keyof Attributes<M>]?: Attributes<M>[key] | Fn | Col | Literal;
      }
    | Partial<M>;

type TFindPaginatedOptions<M extends Model> =
    | SetRequired<FindAndCountOptions<Attributes<M>>, 'group'>
    | Omit<FindAndCountOptions<Attributes<M>>, 'group'>;

export abstract class BaseRepository<M extends Model> implements IRepository<M> {
    private readonly model: ModelCtor<M>;

    protected constructor(model: ModelCtor<M>) {
        this.model = model;
    }

    async update(criteria: UpdateOptions<M>, data: TUpdateData<M>): TUpdateResponse<M> {
        return await this.model.update(data, {
            ...criteria,
            returning: true,
            hooks: true,
            individualHooks: true,
        });
    }

    async create(doc: CreationAttributes<M>, options?: CreateOptions<Attributes<M>>): Promise<M> {
        return await this.model.create(doc, options);
    }

    build(doc: CreationAttributes<M>, options?: CreateOptions<Attributes<M>>): M {
        return this.model.build(doc, options);
    }

    async bulkCreate(docs: CreationAttributes<M>[], options?: BulkCreateOptions<Attributes<M>>): Promise<M[]> {
        return await this.model.bulkCreate(docs, options);
    }

    async findById(id: string | number, options?: Omit<FindOptions<M>, 'where'>): Promise<M> {
        return await this.model.findByPk(id, options);
    }

    async findAllPaginated(query: BaseQuery, options?: TFindPaginatedOptions<M>): Promise<PaginatedResponseDto<M>> {
        const pagination = this.createPagination(query);

        const { rows, count } = await this.model.findAndCountAll({
            limit: pagination.limit,
            offset: pagination.offset,
            order: [[pagination.order, pagination.asc]],
            ...options,
        });

        return new PaginatedResponseDto<M>(rows, count, pagination.page, pagination.limit);
    }

    async findOneByOptions(options: FindOptions<M>): Promise<M> {
        return await this.model.findOne(options);
    }

    async findAllByOptions(options?: FindOptions<M>): Promise<M[]> {
        return await this.model.findAll(options);
    }

    async count(options?: Omit<CountOptions<Attributes<M>>, 'group'>): Promise<number> {
        return await this.model.count(options);
    }

    async delete(criteria: DestroyOptions<M>): Promise<number> {
        return this.model.destroy({
            ...criteria,
            cascade: true,
            individualHooks: true,
            hooks: true,
        });
    }

    private createPagination(query: BaseQuery): TPagination {
        const page = query.page ? +query.page : 1;
        const limit = query.take ? +query.take : 10;
        const offset = (page - 1) * limit;
        const order = query.sort ? query.sort : 'id';
        const asc = query.asc ? query.asc : 'DESC';

        return {
            page,
            limit,
            offset,
            order,
            asc,
        };
    }
}
