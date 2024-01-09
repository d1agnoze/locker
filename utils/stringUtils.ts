import Cryptr from "cryptr";

export function removeDomain(email: string | undefined): string {
    return email ? email.split("@")[0]: "User";
}
export const encrypt = (value:string, mode: "de" | "en"): string => {
  const cryptr = new Cryptr(process.env.EN_KEY!)
  let res
  switch (mode) {
    case "de":
        res = cryptr.decrypt(value);
        break;
    case "en":
        res = cryptr.encrypt(value);
        break;
    default:
        res=""
        break;
  }
  return res
}
