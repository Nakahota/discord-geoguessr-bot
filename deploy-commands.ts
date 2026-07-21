import { REST, Routes, SlashCommandBuilder } from "discord.js";
import config from "./config.json";

const commands = [
  new SlashCommandBuilder()
    .setName("register")
    .setDescription("問題を登録する")

    .addNumberOption(option =>
        option
            .setName("latitude")
            .setDescription("緯度")
            .setRequired(true)
    )

    .addNumberOption(option =>
        option
            .setName("longitude")
            .setDescription("経度")
            .setRequired(true)
    )

    .addStringOption(option =>
        option
            .setName("prefecture")
            .setDescription("都道府県")
            .setRequired(true)
    )

    .addStringOption(option =>
        option
            .setName("city")
            .setDescription("市区町村")
            .setRequired(true)
    )

    .addAttachmentOption(option =>
        option
            .setName("image")
            .setDescription("青看板画像")
            .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("question")
    .setDescription("問題を出題する")
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