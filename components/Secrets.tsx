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
import Supabase from "@/utils/supabase/getSupabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { v4 } from "uuid";
type Input = {
    secrets: Secret[]
}
const Secrets = () => {
    const { register, handleSubmit, control, watch, formState, formState: { errors, isValidating }, setValue } = useForm<Input>({ mode: 'onChange' })
    // @ts-expect-error
    const { fields, remove, append } = useFieldArray<Input>({ control, name: "secrets", keyName: '_id' })
    const [del, setDel] = useState<string[]>([])
    const [selectedDel, setSelectedDel] = useState<number | null>(null)
    const [openAlert, setOpen] = useState<boolean>(false);
    const [prefetch, setPreFetch] = useState<Secret[]>([])
    useEffect(() => {
        //for testing 🧪
        fetch('/api/secret').then(res => res.json()).then(({ data }: { data: Secret[] }) => {
            setValue('secrets', data)
            setPreFetch(data)
        }).catch((_) => { toast.error('Unable to connect to database') })
    }, [])
    useEffect(() => {
        if (!openAlert) {
            setSelectedDel(null)
        }
    }, [openAlert])
    const onSubmit: SubmitHandler<Input> = async (payload) => {
        console.log('comparing...');
        //checking del stack
        if (del.length > 0) {
            console.table(del);
            const supabase = createClientComponentClient()
            const { data, error, status, statusText } = await supabase.rpc('delete_secrets', { "ids": del })
            console.log('err', error);
            console.log('data', data);

            if (!error)
                setDel([])
        }
        const { secrets } = payload
        const output = compareSecretArrays(prefetch, secrets)
        if (output.length > 0) {
            //handle POST
            toast.info('Saving...')
            console.log(output);
            setPreFetch(secrets)
            const supabase = createClientComponentClient()
            const { data, error } = await supabase
                .from('secrets')
                .upsert([...secrets])
                .select()
            if (error) {
                toast.warn(error.message)
            }
        }
    }
    const debouncedPostData = debounce(onSubmit, 3000);
    const data = watch();
    useEffect(() => {
        if (formState.isValid && !isValidating && formState.isDirty)
            debouncedPostData(data);
        return () => debouncedPostData.cancel();
    }, [formState, data, isValidating]);
    // @ts-expect-error
    const makeNewRow = () => { append({ id: v4(), key: "", value: "" }) }
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
        console.log(fields.at(index));

        remove(index)
        setOpen(false)
    }
    return (<>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5">
                <div className="flex gap-3">
                    <button className="btn btn-square btn-primary min-h-0 w-7 h-7 p-0" onClick={makeNewRow}>
                        <Plus size={20} />
                    </button>
                    {/* <button type="submit" className="btn btn-accent min-h-0 h-7 p-0">submit</button> */}
                </div>
                <div className="flex flex-col gap-3">
                    {fields.map((item, index) =>
                        <div className="flex gap-1 items-center" key={index}>
                            {/** @ts-ignore: Unreachable code error*/}
                            <SecretInput secret={item} key={index} refKey={register(`secrets.${index}.key`, { required: true, })} refValue={register(`secrets.${index}.value`, { required: true })} />
                            <button onClick={() => fastDelete(index)} className="btn btn-square btn-ghost min-h-0 w-7 h-7 p-0">
                                <X size={20} />
                            </button>
                        </div>
                    )}
                    {errors.secrets && <div className="toast toast-top toast-end">
                        <div className="alert alert-info ">
                            <span>All fields are required.</span>
                        </div>
                    </div>}
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
 * console.log(resultArray);
 */
function compareSecretArrays(arr1: Secret[], arr2: Secret[]): Secret[] {
    const idsInArr1 = new Set(arr1.map(obj => obj.id));

    const uniqueAndChangedElementsInArr2 = arr2.filter(obj => {
        // Check if the element is not present in arr1 or if the key or value has changed
        return (
            !idsInArr1.has(obj.id) ||
            arr1.some(
                oldObj =>
                    oldObj.id === obj.id &&
                    (oldObj.key !== obj.key || oldObj.value !== obj.value)
            )
        );
    });

    return uniqueAndChangedElementsInArr2;
}