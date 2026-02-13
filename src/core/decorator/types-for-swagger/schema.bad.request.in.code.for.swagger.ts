export const schemaBadRequestInCodeForSwagger = {
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
            },
        },
        timestamp: { type: 'string', format: 'date-time' },
        path: { type: 'string' },
        message: { type: 'string' },
    },
};
