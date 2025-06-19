"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwite";
import { appwriteConfig } from "../appwite/config";
import { parseStringify } from "../utils";

const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();
  const result = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal("email", email)]
  );

  return result.total > 0 ? result.documents[0] : null;
};

const handleError = (error: unknown, message: string) => {
  console.error(error, message);
  throw error;
};

const sedEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailToken(ID.unique(), email);
    return session.userId;
  } catch (error) {
    handleError(error, "Failed to send email OTP");
  }
};

export const createAccount = async ({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) => {
  const exisitingUser = await getUserByEmail(email);
  const accountId = await sedEmailOTP({ email });
  if (!accountId) throw new Error("Failed to  send email OTP");

  if (!exisitingUser) {
    const { databases } = await createAdminClient();

    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      {
        fullName,
        email,
        avatar:
          "https://th.bing.com/th/id/OIP.UhqrY29sJDhTG2gaOwEBAQHaHa?rs=1&pid=ImgDetMain&cb=idpwebp2&o=7&rm=3",
        accountId,
      }
    );
  }
  return parseStringify({ accountId });
};
