import * as bcrypt from 'bcryptjs';
export const jwtConstants = {
  secret: 'SECRET',
};

export const hashPass = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(password, salt);
};
