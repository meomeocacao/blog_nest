import * as bcrypt from 'bcryptjs';
export const jwtConstants = {
  secret: 'bongmeomeo0904',
  accessExpires: '24h',
  refreshSecret: 'cacao3010',
  refreshExpires: '500000h',
};

export const hashPass = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(password, salt);
};
