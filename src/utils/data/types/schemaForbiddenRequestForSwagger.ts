export const schemaForbiddenForSwagger = {
    type: 'object',
    required: ['response', 'timestamp', 'path', 'message'],
    properties: {
        response: {
            type: 'object',
            required: ['message', 'status'],
            properties: {
                message: {
                    type: 'string',
                    example: 'Access denied'
                },
                status: {
                    type: 'integer',
                    example: 403
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
            example: '/api/v1/admin/users'
        },
        message: {
            type: 'string',
            example: 'Forbidden resource'
        },
    },
};