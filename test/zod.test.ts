import {z, ZodError, ZodType} from "zod"

describe("aaaa", ()=> {
    it("ads", ()=> {

        const person: ZodType = z.object({
            name: z.string("Value of name must be string.")
                    .min(5, "Value of name must be between 5 to 10 characters.")
                    .max(10, "Value of name must be between 5 to 10 characters."),
            age: z.number("Value of age must be number.").min(0).max(60)
        })


        try {
            const res = person.parse({
                name: "johndoe",
                age: true
            })
        }catch (err) {
            if (err instanceof ZodError) {
                const errs = err.issues.map(i => i.message)
                console.log(errs)
            }
        }

    })

    it("obj", ()=>{

        const a = {
            name: "who",
            age: 12
        }

        const b = {
            ...a,
            king: a.name
            
        }

        console.log(a)
        console.log(b)

        const d = new Date()
        console.log(d)
    })
})
