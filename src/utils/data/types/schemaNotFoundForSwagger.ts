export const schemaNotFoundForSwagger = {
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
                            message: { type: 'string' },
                            error: { type: 'string', example: 'Not Found' },
                            statusCode: { type: 'integer', example: 404 },
                        },
                    },
                },
            },
        },
        timestamp: { type: 'string', format: 'date-time' },
        path: { type: 'string' },
        message: { type: 'string' },
    },
};