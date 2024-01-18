"use client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import Secret from "@/models/secret";
import { useEffect, useState } from "react";
import SecretInput from "./SecretInput";
import { Plus, X } from "lucide-react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { debounce } from 'lodash';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { v4 } from "uuid";
import useSaved from "@/utils/hooks/useSaved";
type Input = {
    secrets: Secret[]
}
const Secrets = () => {
    const { register, control, watch, formState, formState: { errors, isValidating }, setValue } = useForm<Input>({ mode: 'onChange' })
    // @ts-expect-error
    const { fields, remove, append } = useFieldArray<Input>({ control, name: "secrets", keyName: '_id' })
    const [del, setDel] = useState<string[]>([])
    const [selectedDel, setSelectedDel] = useState<number | null>(null)
    const [openAlert, setOpen] = useState<boolean>(false);
    const [prefetch, setPreFetch] = useState<Secret[]>([])
    useEffect(() => {
        fetch('/api/secret').then(res => res.json()).then(({ decrypt }: { decrypt: Secret[] }) => {
            const first_fetch = decrypt ? decrypt : []
            setValue('secrets', first_fetch)
            setPreFetch(first_fetch)
        }).catch((_) => { toast.error('Unable to connect to database') })
    }, [])
    useEffect(() => {
        if (!openAlert) {
            setSelectedDel(null)
        }
    }, [openAlert])
    const onSubmit: SubmitHandler<Input> = async (payload) => {
        if (del.length > 0) {
            const supabase = createClientComponentClient()
            const { error } = await supabase.rpc('delete_secrets', { "ids": del })
            error ? setDel([]) : toast.error(error.message)
        }
        const { secrets } = payload
        const updatedSecrets = useSaved(secrets);
        const output = compareSecretArrays(prefetch, updatedSecrets)
        if (output.length > 0) {
            toast.info('Saving...')
            await fetch('/api/secret', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify(output)
            }).then(() => { setPreFetch([...updatedSecrets]) }).catch((error) => { toast.warn(error.message) })
        }
    }
    const debouncedPostData = debounce(onSubmit, 2000);
    const data = watch();
    useEffect(() => {
        if (formState.isValid && !isValidating && formState.isDirty)
            debouncedPostData(data);
        return () => debouncedPostData.cancel();
    }, [formState, data, isValidating]);
    // @ts-expect-error
    const makeNewRow = () => { append({ id: v4(), key: "", value: "", title: "" }) }
    const fastDelete = (index: number) => {
        // @ts-expect-error
        if (fields.at(index) == null || fields.at(index)?.key == "" || fields.at(index)?.value == "")
            remove(index)
        else {
            setSelectedDel(index)
            setOpen(true)
        }
    }
    const deleteRow = (index: number | null): void => {
        if (!index)
            return
        fields.at(index)?.id ? setDel([...del, fields.at(index)!.id]) : null
        remove(index)
        setOpen(false)
    }
    return (<>
        <form onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-5">
                <div className="flex gap-3">
                    <button className="btn btn-square btn-primary min-h-0 w-7 h-7 p-0" onClick={makeNewRow}><Plus size={20} /></button>
                </div>
                <div className="flex flex-col gap-3">
                    {fields.map((item, index) =>
                        <div className="flex flex-col" key={item.id}>
                            <Input type="text" className="border-none h-5 focus:border-b-primary p-0" {...register(`secrets.${index}.title`)} />
                            <div className="divider m-0"></div>
                            <div className="flex gap-1 items-center" >
                                {/** @ts-ignore: Unreachable code error*/}
                                <SecretInput secret={item} key={index} refKey={register(`secrets.${index}.key`, { required: true, })} refValue={register(`secrets.${index}.value`, { required: true })} />
                                <button onClick={() => fastDelete(index)} className="btn btn-square btn-ghost min-h-0 w-7 h-7 p-0">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                    )}
                    {errors.secrets && <div className="toast toast-top toast-end"><div className="alert alert-info "><span>All fields are required.</span></div></div>}
                </div>
            </div>
        </form>
        <Dialog open={openAlert} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px] border-0 rounded-2xl bg-slate-800">
                <DialogHeader>
                    <DialogTitle>Confirmation</DialogTitle>
                    <DialogDescription>
                        This change is not reversable, r u sure😟?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <button className="btn btn-active btn-ghost" type="submit" onClick={() => deleteRow(selectedDel)}>Get 'em off my saves!!!</button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
    );
}

export default Secrets;


/**
 * Compares two arrays of Secret objects and returns an array of elements from the second array that don't appear in the first array or have changes in key or value.
 *
 * @param {Secret[]} arr1 - The first array of Secret objects.
 * @param {Secret[]} arr2 - The second array of Secret objects.
 * @returns {Secret[]} - An array of Secret objects from arr2 that are unique or have changes.
 * @example
 * const array1 = [
 *   { id: '1', key: 'username', value: 'john_doe' },
 *   { id: '2', key: 'password', value: 'secure123' }
 * ];
 *
 * const array2 = [
 *   { id: '2', key: 'password', value: 'new_secure_password' },
 *   { id: '3', key: 'email', value: 'john.doe@example.com' }
 * ];
 *
 * const resultArray = compareSecretArrays(array1, array2);
 */
function compareSecretArrays(arr1: Secret[], arr2: Secret[]): Secret[] {
    const idsInArr1 = new Set(arr1.map(obj => obj.id));
    const uniqueAndChangedElementsInArr2 = arr2.filter(obj => {
        return (!idsInArr1.has(obj.id) || arr1.some(oldObj => oldObj.id === obj.id && (oldObj.key !== obj.key || oldObj.value !== obj.value || (oldObj.title !== obj.title && !(oldObj.title == null && obj.title.trim() === '')))));
    });
    return uniqueAndChangedElementsInArr2;
}