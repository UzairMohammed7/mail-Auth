import jwt from 'jsonwebtoken'

export const generateTokenAndSetCookies = (res, userid) => {
    const token = jwt.sign({ userId: userid }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 60 * 60 * 24 * 1000
    })
}