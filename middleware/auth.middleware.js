import jwt from "jsonwebtoken"
export const isLoggedIn = async (req, res, next) => {
    try {
        console.log(req.cookies);
        const token = req.cookies?.token

        console.log("Token Found", token ? "YES" : "NO")

        if (!token) {
            console.log("No token");
            return res.status(401).json({
                success: false,
                message: "Authentication failed"
            })
        }

        const decoded = await jwt.verify(token, process.env.SECRET_KEY)
        console.log("decoded data :", decoded);

        req.user = decoded

        next()


    } catch (error) {
        console.log("Auth middleware failure");
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
} 