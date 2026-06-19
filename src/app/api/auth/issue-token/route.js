import jwt from "jsonwebtoken";
import { cookies, headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function POST() {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
        return Response.json({ message: "unauthorized" }, { status: 401 });
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

    const cookieStore = await cookies();
    cookieStore.set("access_token", token, {
        httpOnly: true,
        secure:   process.env.NODE_ENV === "production",
        sameSite: "lax",
        path:     "/",
        maxAge:   60 * 60 * 24 * 7, // 7 days
    });

    return Response.json({ success: true, role: session.user.role });
}