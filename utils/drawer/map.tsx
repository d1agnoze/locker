export const drawer_map: drawer[] = [
    { display_text: 'Your Secret 🙁', link: "/dashboard/secret" },
    { display_text: 'Your Notes 📝', link: "/dashboard/notes" }
]
interface drawer {
    display_text: string,
    link: string,
}
