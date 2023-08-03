import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { MAX_FREE_COUNTS } from "@/constants";

export const increaseApiLinit = async () => {
    const { userId } = auth();

    if (!userId) {
        return;
    }

    const UserApiLimit = await prismadb.userApiLimit.findUnique({
        where: {
            userId
        }
    });

    if (UserApiLimit) {
        await prismadb.userApiLimit.update({
            where: { userId: userId },
            data: { count: UserApiLimit.count + 1 },
        });
    }
    else {
        await prismadb.userApiLimit.create({
            data: { userId: userId, count: 1 }
        });
    }
}

export const checkApiLimit = async () => {
    const { userId } = auth()

    if (!userId) {
        return false
    }

    const userApiLimit = await prismadb.userApiLimit.findUnique({
        where: {
            userId: userId
        }
    });

    if (!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS) {
        return true;
    }
    else {
        return false;
    }
}

export const getApiLimitCount = async () => {
    const { userId } = auth();

    if (!userId) {
        return 0
    }

    const userApiLimit = await prismadb.userApiLimit.findUnique({
        where: {
            userId
        }
    });

    if (!userApiLimit) {
        return 0
    }

    return userApiLimit.count;
}