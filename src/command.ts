import { ChatInputCommandInteraction } from "discord.js";
import prisma from "./client";

type RegisterQuestionParams = {
    prefecture: string;
    city: string;
    latitude: number;
    longitude: number;
    imageUrl: string;
};

// 問題登録処理
export async function registerQuestion(interaction: ChatInputCommandInteraction) {
    const prefecture = interaction.options.getString(
        "prefecture",
        true
    );

    const city = interaction.options.getString(
        "city",
        true
    );

    const latitude = interaction.options.getNumber(
        "latitude",
        true
    );

    const longitude = interaction.options.getNumber(
        "longitude",
        true
    );

    const image = interaction.options.getAttachment(
        "image",
        true
    );

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

            const imageRecord = await tx.image.create({
                data: {
                    url: image.url
                }
            });

            return await tx.question.create({
                data: {
                    locationId: location.id,
                    imageId: imageRecord.id
                }
            });
        });

        return question;

    } catch (error) {
        console.error(error);
        throw error;
    }
}

// 問題送信処理
export async function sendQuestion(interaction: ChatInputCommandInteraction): Promise<void> {

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