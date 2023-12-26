import { generate } from './generator/fix_char.ts'
import { exists } from "https://deno.land/std@0.210.0/fs/mod.ts"

if (await exists("build", { isReadable: true, isDirectory: true })) {
    await Deno.mkdirSync("build", { recursive: true })
}

await Deno.writeTextFile("build/fix_char.ts", generate())
