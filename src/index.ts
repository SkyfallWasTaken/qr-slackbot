const {App} = await import('@slack/bolt');
import {image as qrImage} from "qr-image"
import 'dotenv/config'

const app = new App({
    token: process.env['SLACK_BOT_TOKEN'],
    signingSecret: process.env['SLACK_SIGNING_SECRET']
});

const linkRegex = /<([^|]+)\|([^>]+)>/g;
function stripSlackMarkdownLinks(text: string): string {
    // Replace matches with the display text (second capture group)
    return text.replace(linkRegex, '$2');
}

app.message(async ({message}) => {
    if (!message.subtype && !message.thread_ts && message.text) {
        const response = await app.client.filesUploadV2({
            file_uploads: [
                {
                    file: qrImage(stripSlackMarkdownLinks(message.text), {type: 'png'}),
                    filename: "qr.png",
                }
            ],
            channel_id: message.channel,
            initial_comment: `:wave-pikachu-2: Here's your QR code, <@${message.user}>!`,
            thread_ts: message.thread_ts ?? message.ts,
        })
        if (!response.ok || !Array.isArray(response['files'])) {
            throw new Error(response.error);
        }
    }
});

await app.start(process.env['PORT'] || 3000);
console.log('⚡️ Bolt app is running!');