import * as bcrypt from 'bcrypt';

const saltRounds = 10;

export const hashPassword = async (rawPassword: string): Promise<string> => {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(rawPassword, salt);
        return hashedPassword;
    } catch (error) {
        throw error;
    }
}

export const checkPassword = async (hashedPassword: string, rawPassword: string): Promise<boolean> => {
    try {
        const match = await bcrypt.compare(rawPassword, hashedPassword);
        return match;
    } catch (error) {
        throw error;
    }
}