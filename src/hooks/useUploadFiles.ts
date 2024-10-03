import { trpc } from "../trpc/client";

export const useUploadFiles = () => {
    const { mutateAsync: getPresignedFilesURL } = trpc.s3.getPresignedFilesURL.useMutation();
    const { mutateAsync: getPresignedAvatarURL } = trpc.s3.getPresignedUrlAvatar.useMutation();

    const uploadFiles = async (files: File[]) => {
        const presignedFilesURL = await getPresignedFilesURL({ keys: files.map((file) => file.name) });

        await Promise.all(files.map((file, index) => uploadFile(file, presignedFilesURL[index].url)));

        return presignedFilesURL.map((url) => url.fileUrl);

    };

    const uploadAvatar = async (file: File) => {

        const key = `avatars/${file.name}`;
        const presignedAvatarURL = await getPresignedAvatarURL({ key });

        await uploadFile(file, presignedAvatarURL.url);

        return presignedAvatarURL.imageUrl;

    };


    return { uploadFiles, uploadAvatar };

}


const uploadFile = async (file: File, presignedURL: string) => {
    const response = await fetch(presignedURL, {
        method: 'PUT',
        body: file,
    });
    return response.ok;
};