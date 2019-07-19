export interface People {
  id: string;
  name: string;
  nickname?: string;
  phoneNumber?: string;
  externalIdentifier?: string;
  address: string;
  isBanned?: boolean;
  bannedDescription?: any;
}
