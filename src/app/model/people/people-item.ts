export interface PeopleItem {
  id?: number;
  name: string;
  birthDate: Date;
  gender: string;
  address: string;
  phone: number;
  email: string;
  isEmployee?: boolean;
  bankAccounts?: PeopleBankAccount[];
}


export interface PeopleBankAccount {
  id: number;
  bic: string;
  createDate: Date;
  bankAccount: string;
  inn: string;
  cardType: string;
  cardTypeName: string;
}
