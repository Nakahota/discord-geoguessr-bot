import { ChatInputCommandInteraction } from "discord.js";
import prisma from "./client";

// 問題登録処理
export async function registerQuestion(interaction: ChatInputCommandInteraction): Promise<void> {

    const prefecture = interaction.options.getString("prefecture", true);
    const city = interaction.options.getString("city", true);
    const latitude = interaction.options.getNumber("latitude", true);
    const longitude = interaction.options.getNumber("longitude", true);
    const imageUrl = interaction.options.getString("image_url", true);

    try {

        const question = await prisma.$transaction(async (tx) => {

            const location = await tx.location.create({
                data: {
                    prefecture,
                    city,
                    latitude,
                    longitude
                }
            });

            const image = await tx.image.create({
                data: {
                    url: imageUrl
                }
            });

            return await tx.question.create({
                data: {
                    locationId: location.id,
                    imageId: image.id
                }
            });

        });

        await interaction.reply({
            content: `問題(ID: ${question.id})を登録しました。`
        });

    } catch (error) {

        console.error(error);

        await interaction.reply({
            content: "問題登録に失敗しました。",
            ephemeral: true
        });

    }
}

// 問題送信処理
export async function sendQuestion(
    interaction: ChatInputCommandInteraction
): Promise<void> {

    try {

        const question = await prisma.question.findFirst({
            include: {
                location: true,
                image: true
            },
            orderBy: {
                id: "asc"
            }
        });

        if (!question) {

            await interaction.reply({
                content: "問題が登録されていません。"
            });

            return;
        }

        await interaction.reply({
            content:
`## 問題

画像: ${question.image.url}`
        });

    } catch (error) {

        console.error(error);

        await interaction.reply({
            content: "問題取得に失敗しました。",
            ephemeral: true
        });

    }
}