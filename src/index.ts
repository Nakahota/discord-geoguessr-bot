import config from "../config.json"
import { MessageFlags, Client, GatewayIntentBits } from "discord.js";
import prisma from "./client"

// Botのクライアントを作成
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// 起動時の処理
client.once('clientReady', async () => {
    if (client.user === null) {
        return;
    }
    console.log(`${client.user.tag} としてログインしました`);

    try {
        await prisma.$connect();
        console.log("PostgreSQL connected");
    } catch(error) {
        console.log("PostgreSQL connectError")
    }
});

// コマンドを受け取ったときの処理
client.on('interactionCreate', async (interaction) => {
    // スラッシュコマンドのみ処理する
    if (!interaction.isChatInputCommand()) return;

    // /ephemeralだった場合、非公開メッセージを送信する
    if (interaction.commandName === "ephemeral") {

        const message = interaction.options.getString("message", true);

        await interaction.reply({
            content: `あなたが送信した文言は「${message}」`,
            flags: MessageFlags.Ephemeral,
        });
    }
    // /helloだった場合、挨拶を返します。
    if (interaction.commandName === "hello") {
        await interaction.reply("こんにちは");
    }
});

// 以下にトークンの貼り付け
client.login(config.token);