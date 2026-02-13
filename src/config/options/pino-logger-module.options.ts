import { Params } from 'nestjs-pino/params';

export default (): Params | undefined => ({
    pinoHttp: {
        level: 'trace',
        transport: {
            targets: [
                {
                    level: 'trace',
                    target: 'pino-pretty',
                    options: {
                        colorize: true,
                        singleLine: true,
                        translateTime: "yyyy-mm-dd'T'HH:MM:ss.l'Z'",
                        ignore: 'pid,hostname',
                        minimumLevel: 'info',
                        errorLikeObjectKeys: ['err', 'error'],
                    },
                },
                {
                    target: 'pino/file',
                    level: 'trace',
                    options: { destination: `${__dirname}/../server.log` },
                },
            ],
        },
    },
});
