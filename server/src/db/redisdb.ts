import { createClient } from 'redis';

// redis DB
export const client = createClient({
    password: 'GT1JkpEgYwrm7QLDTfR9oZqF6V2S6Pgu',
    socket: {
        host: 'redis-13812.c290.ap-northeast-1-2.ec2.cloud.redislabs.com',
        port: 13812,
    },
});
client.connect();

client.on('error', err => console.log('Redis Client Error', err));
client.on('connected', () => console.log('Redis Client Connected'));
client.on('ready', () => console.log('Redis Client Ready'));
