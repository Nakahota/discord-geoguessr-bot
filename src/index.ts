import { MessageFlags, Client, GatewayIntentBits } from "discord.js";
import prisma from "./client";
import { registerQuestion } from "./command";
import { sendQuestion } from "./command";

const token = process.env.DISCORD_TOKEN;

if (!token) {
    throw new Error("DISCORD_TOKEN is not set");
}

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
        console.log("PostgreSQL connectError", error);
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

    // /registerコマンドを受け取ったら問題登録処理を行う
    if (interaction.commandName === "register") {
        try {
            const question = await registerQuestion(interaction);

            await interaction.reply({
                content: `問題(ID: ${question.id})を登録しました。`,
                flags: MessageFlags.Ephemeral,
            });

        } catch (error) {
            console.error(error);

            await interaction.reply({
                content: "問題登録に失敗しました。",
                flags: MessageFlags.Ephemeral,
            });
        }
    }

    // /questionコマンドを受け取ったら問題送信処理を行う
    if (interaction.commandName === "question") {
        await sendQuestion(interaction);
    }

    // /helloだった場合、挨拶を返します。
    if (interaction.commandName === "hello") {
        await interaction.reply("こんにちは");
    }
});

// 以下にトークンの貼り付け
client.login(token);
