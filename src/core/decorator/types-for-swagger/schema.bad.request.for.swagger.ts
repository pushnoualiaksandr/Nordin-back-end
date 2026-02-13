export const schemaBadRequestForSwagger = {
    type: 'object',
    properties: {
        response: {
            type: 'object',
            properties: {
                validationMessage: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            field: { type: 'string' },
                            message: { type: 'string' },
                        },
                    },
                },
                message: { type: 'string', example: 'Validation error' },
                status: { type: 'integer', example: 400 },
            },
        },
        timestamp: { type: 'string', format: 'date-time' },
        path: { type: 'string' },
        message: { type: 'string', example: 'Validation error' },
    },
};
