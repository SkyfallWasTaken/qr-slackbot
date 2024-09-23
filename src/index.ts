const {App} = await import('@slack/bolt');
import {image as qrImage} from "qr-image"
import 'dotenv/config'

const app = new App({
    token: process.env['SLACK_BOT_TOKEN'],
    signingSecret: process.env['SLACK_SIGNING_SECRET']
});

const linkRegex = /<([^|]+)\|([^>]+)>/g;
const urlRegex = /^(https?:\/\/)/;
function stripSlackMarkdownLinks(text: string): string {
    // Replace matches with properly formatted URLs
    return text.replace(linkRegex, (_, url) => {
        // Check if URL starts with http/https, otherwise prepend https://
        if (!urlRegex.test(url)) {
            url = `https://${url}`;
        }
        return url;
    });
}

const maxLength = 1024; // https://en.wikipedia.org/wiki/QR_code

app.message(async ({message}) => {
    if (!message.subtype && !message.thread_ts) {
        if (!message.text) {
            await app.client.chat.postMessage({
                channel: message.channel,
                text: `:browtffr: You can't make images/files into a QR code!`,
                thread_ts: message.ts,
            });
            return;
        }

        if (message.text.length > maxLength) {
            await app.client.chat.postMessage({
                channel: message.channel,
                text: `:browtffr: Your message is too long to be encoded into a QR code. Please try again with a shorter message.`,
                thread_ts: message.ts,
            });
            return;
        }

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