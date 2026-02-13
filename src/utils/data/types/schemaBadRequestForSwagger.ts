

export const schemaBadRequestForSwagger = {
    type: 'object',
    required: ['response', 'timestamp', 'path', 'message'],
    properties: {
        response: {
            type: 'object',
            required: ['validationMessage', 'message', 'status'],
            properties: {
                validationMessage: {
                    type: 'array',
                    items: {
                        type: 'object',
                        required: ['field', 'message'],
                        properties: {
                            field: {
                                type: 'string',
                                example: 'street'
                            },
                            message: {
                                type: 'string',
                                example: 'Street address must be a string'
                            },
                        },
                    },
                },
                message: {
                    type: 'string',
                    example: 'Validation error'
                },
                status: {
                    type: 'integer',
                    example: 400
                },
            },
        },
        timestamp: {
            type: 'string',
            format: 'date-time',
            example: '2026-02-02T12:30:41.280Z'
        },
        path: {
            type: 'string',
            example: '/api/v1/clinic'
        },
        message: {
            type: 'string',
            example: 'Validation error'
        },
    },
};