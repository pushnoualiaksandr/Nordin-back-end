import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationsTypes } from 'src/utils/data/enums/NotificationsTypes';

type EventPayload = symbol | string | (symbol | string)[];

@Injectable()
export class BusFacadeService {
    static readonly EVENTS = {
        USER: {
            BOOKING_UPDATED: 'user.booking.updated',
        },
        NOTIFICATIONS: {
            NOTIFY_USER_BOOKING_UPDATED: NotificationsTypes.BOOKING_STATUS_UPDATED,
        },
    };
    constructor(private readonly eventBus: EventEmitter2) {}

    emit(event: EventPayload, ...values: unknown[]): boolean {
        return this.eventBus.emit(event, ...values);
    }
}
