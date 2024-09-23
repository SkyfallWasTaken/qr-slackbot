const { App } = await import('@slack/bolt');
import { image as qrImage } from "qr-image"
import 'dotenv/config'

const app = new App({
    token: process.env['SLACK_BOT_TOKEN'],
    signingSecret: process.env['SLACK_SIGNING_SECRET']
});

app.message(async ({ message, say }) => {
    if (!message.subtype) {

    }
});

await app.start(process.env['PORT'] || 3000);
console.log('⚡️ Bolt app is running!');