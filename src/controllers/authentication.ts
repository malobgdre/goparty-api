import express from 'express';
import { createUser, getUserByEmail } from 'db/Users';
import { authentication, random } from 'helpers';

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password, username } = req.body;

        if(!email || !password || !username) return res.sendStatus(400);

        const userExists = await getUserByEmail(email);

        if(userExists) res.sendStatus(400);

        const salt = random()
        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password)
            }
        });

        return res.sendStatus(200).json(user).end();
    } catch(error) {
        console.log(error)
        return res.sendStatus(400)
    }
}