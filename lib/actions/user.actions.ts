"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwite";
import { appwriteConfig } from "../appwite/config";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

export const sedEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailToken(ID.unique(), email);
    return session.userId;
  } catch (error) {
    handleError(error, "Failed to send email OTP");
  }
};

/*
  ? This function creates a new user account with the provided full name and email.
  * It checks if a user with the given email already exists, and if not, it sends an OTP to the email.
  * If the user does not exist, it creates a new document in the users collection with the provided details.
  * It returns the account ID of the newly created or existing user.
  * Usage: Call this function when a user signs up or registers for an account.
  * Example: await createAccount({ fullName: 'John Doe', email: '
*/
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

/* 
 ? This function verifies the OTP sent to the user's email and creates a session.
 * It sets a cookie with the session secret for authentication.
 * It returns the session ID if successful, or throws an error if verification fails.
 * Usage: Call this function after the user submits the OTP they received via email.
 * Example: await verifySecret({ accountId: 'user_account_id', password: '123456' });
 * Note: Ensure to handle the session cookie securely in your application.
 * Important: This function is intended to be used in a server-side context, such as in
 * a Next.js API route or server action, to maintain security and prevent exposure of sensitive data
 * to the client.*/
export const verifySecret = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) => {
  try {
    const { account } = await createAdminClient();
    const session = await account.createSession(accountId, password);

    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });

    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    handleError(error, "Failed to verify OTP");
  }
};

export const getCurrentUser = async () => {
  const { databases, account } = await createSessionClient();
  const result = await account.get();
  const user = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal("accountId", result.$id)]
  );

  if (user.total <= 0) return null;
  return parseStringify(user.documents[0]);
};

export const signOutUser = async () => {
  const { account } = await createSessionClient();
  try {
    await account.deleteSession("current");
    (await cookies()).delete("appwrite-session");
  } catch (error) {
    handleError(error, "Failed to sign out user");
  } finally {
    redirect("/sign-in");
  }
};
