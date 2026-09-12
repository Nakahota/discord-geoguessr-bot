import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import prisma from "./client";

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

        console.log(`問題登録処理を行います`);

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

        console.log(`問題登録処理が完了しました`);

        return question;

    } catch (error) {

        console.log(`問題登録処理に失敗しました`);
        console.error(error);
        throw error;

    }
}

// 問題送信処理
export async function sendQuestion(interaction: ChatInputCommandInteraction): Promise<void> {

    try {

        console.log(`問題送信処理を行います`);

        // 3秒以内にInteractionを受け付けないと無効エラーが返ってしまうため、処理中をDiscordに送信
        await interaction.deferReply();

        const count = await prisma.question.count();

        if (count === 0) {
        await interaction.editReply({
            content: "問題が登録されていません。",
        });

        console.log(`問題が登録されていないため、問題送信処理に失敗しました`);
        
        return;
        }

        const randomIndex = Math.floor(Math.random() * count);

        const questions = await prisma.question.findMany({
        skip: randomIndex,
        take: 1,
        include: {
            location: true,
            image: true,
        },
        });

        const question = questions[0];

        await interaction.editReply({
            content: "青看板の場所を当ててください",
            files: [
                question.image.url
            ],
        });

        console.log(`問題送信処理に成功しました`);

    } catch (error) {

        console.log(`問題登録処理に失敗しました`);
        console.error(error);

        await interaction.editReply({
            content: "問題取得に失敗しました。",
        });

    }
}