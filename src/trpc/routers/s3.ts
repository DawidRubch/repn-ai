import { z } from "zod";
import { createTRPCRouter, protectedProcedutre } from "../init";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {
    getSignedUrl,
} from "@aws-sdk/s3-request-presigner";
import { env } from "../../env";


export const s3Router = createTRPCRouter({
    getPresignedUrlAvatar: protectedProcedutre.input(z.object({
        file: z.instanceof(File),
    })).mutation(async ({ ctx, input }) => {
        const key = `${ctx.auth.userId}/avatar`
        const url = await generatePresignedUrl(key, env.AWS_S3_BUCKET_NAME_AVATARS)

        const imageUrl = `https://${env.AWS_S3_BUCKET_NAME_AVATARS}.s3.amazonaws.com/${key}`

        return { url, imageUrl }
    }),

    getPresignedFilesURL: protectedProcedutre.input(z.object({
        files: z.array(z.instanceof(File)),
    })).mutation(async ({ ctx, input }) => {
        const { files } = input;

        const uploadedFiles = await Promise.all(files.map(async (file) => {
            const key = `${ctx.auth.userId}/${file.name}`
            const url = await generatePresignedUrl(key, env.AWS_S3_BUCKET_NAME_FILES)
            const fileUrl = `https://${env.AWS_S3_BUCKET_NAME_FILES}.s3.amazonaws.com/${key}`
            return { url, fileUrl }
        }))



        return uploadedFiles
    }),


});




const s3 = new S3Client({
    region: env.AWS_REGION,
    credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
});

export const generatePresignedUrl = async (key: string, bucketName: string) => {
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
    });


    return getSignedUrl(s3, command, { expiresIn: 3600 });

}