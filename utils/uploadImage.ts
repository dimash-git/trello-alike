import { ID, storage } from "@/appwrite";

const uploadImage = async (image: File) => {
  if (!image) return;

  const uploaded = await storage.createFile(
    process.env.NEXT_PUBLIC_TODOS_IMAGES_BUCKET_ID!,
    ID.unique(),
    image
  );

  return uploaded;
};

export default uploadImage;
