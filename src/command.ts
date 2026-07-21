import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";

export const ephemeral = {
  data: new SlashCommandBuilder().setName('ephemeral').setDescription('あなたにだけ見えるコメントを送信します。'),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply({
      content: "非公開になってますか？",
      flags: MessageFlags.Ephemeral,
    });
  },
};