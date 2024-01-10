import Secret from "@/models/secret";
import { cloneDeep } from "lodash";
const useSaved = (secret: Secret[]) => {
    const deep = cloneDeep(secret)
    return deep;
}

export default useSaved;