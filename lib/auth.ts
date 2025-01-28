import jwt from "jsonwebtoken"

export async function verifyToken(token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
      if (err) return reject(err)
      resolve(decoded)
    })
  })
}

