import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { MongoClient } from "mongodb";

const mongoClient = new MongoClient(process.env.MONGO_DB_URI);

async function getUsersCollection() {
    await mongoClient.connect().catch(() => {});
    return mongoClient.db(process.env.MONGO_DB_NAME || "StartupForge_db").collection("user");
}

export async function POST(request) {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
        return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    try {
        const usersCol = await getUsersCollection();
        const dbUser = await usersCol.findOne(
            { email: session.user.email },
            { projection: { isBlocked: 1 } }
        );
        if (dbUser?.isBlocked) {
            return NextResponse.json(
                { message: "Your account has been blocked. Please contact support." },
                { status: 403 }
            );
        }
    } catch {
    }

    const token = jwt.sign(
        {
            id:    session.user.id,
            email: session.user.email,
            role:  session.user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    const response = NextResponse.json({ success: true, role: session.user.role });
    response.cookies.set("access_token", token, {
        httpOnly: true,
        secure:   process.env.NODE_ENV === "production",
        sameSite: "lax",
        path:     "/",
        maxAge:   60 * 60 * 24 * 7, // 7 days
    });

    return response;
}