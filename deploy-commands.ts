import { REST, Routes, SlashCommandBuilder } from "discord.js";
import config from "./config.json";

const commands = [
  new SlashCommandBuilder()
    .setName("ephemeral")
    .setDescription("非公開メッセージを送信")
    .addStringOption(option =>
      option
        .setName("message")
        .setDescription("送りたい内容")
        .setRequired(true)
    )
    .toJSON(),

  new SlashCommandBuilder()
    .setName("hello")
    .setDescription("挨拶します")
    .toJSON(),
];

const rest = new REST({ version: "10" }).setToken(config.token);

async function deploy() {
  try {
    console.log("コマンドを登録中...");

    await rest.put(
      Routes.applicationGuildCommands(
        config.clientId,
        config.guildId
      ),
      {
        body: commands,
      }
    );

    console.log("登録完了！");
  } catch (error) {
    console.error(error);
  }
}

deploy();