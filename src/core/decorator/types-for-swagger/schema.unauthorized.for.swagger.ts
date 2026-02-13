export const schemaUnauthorizedForSwagger = {
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
                            message: { type: 'string', example: 'Unauthorized' },
                            statusCode: { type: 'integer', example: 401 },
                        },
                    },
                },
            },
        },
        timestamp: { type: 'string', format: 'date-time' },
        path: { type: 'string' },
        message: { type: 'string', example: 'Unauthorized' },
    },
};
