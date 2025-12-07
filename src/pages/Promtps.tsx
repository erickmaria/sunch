import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useUserSettings } from "@/hooks/useUserSettings"
import { zodResolver } from "@hookform/resolvers/zod"
import { X } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formPromptSchema = z.object({
  title: z.string().nonempty({
    message: "Title cannot be empty.",
  }),
  instructions: z.string().nonempty({
    message: "Content cannot be empty.",
  }),
  default: z.boolean()
})

export default function Promtps() {

  const { getConfig, setConfig, dispatchSyncConfig } = useUserSettings();
  const [Id, setId] = useState("");

  // sync configs
  useEffect(() => {
    const removeListener = window.system.syncConfig((data) => {
      if (data.key.startsWith("prompts")) {
        if (data.key == "prompts.#new#") {
          setId("")
          return
        }

        const prompts = data.value as { title: string; content: string, default: boolean }
        promptForm.setValue("title", prompts.title);
        promptForm.setValue("instructions", prompts.content);
        promptForm.setValue("default", prompts.default);

        setId(data.key.split(".")[1])
      }
    });

    return () => {
      removeListener();
    };
  });

  const promptForm = useForm<z.infer<typeof formPromptSchema>>({
    resolver: zodResolver(formPromptSchema),
    defaultValues: {
      title: "",
      instructions: "",
      default: false
    }
  })

  function onSubmit(values: z.infer<typeof formPromptSchema>) {

    let uuid: string = crypto.randomUUID()
    if (Id != "") {
      uuid = Id
    }

    if (values.default) {

      const prompts = getConfig(`prompts`) as unknown as Map<string, { title: string, content: string, default: boolean }>;

      Object.entries(prompts).map(([key, value]) => {
        if (value.default) {
          value.default = false
          setConfig(`prompts.${key}`, value)
        }
      })
    }

    setConfig(`prompts.${uuid}`, values)

    dispatchSyncConfig(`prompts.#update#`, null)
    closeWindow()
  }

  function closeWindow() {
    window.system.closeWindow("prompts")
    promptForm.clearErrors()
    promptForm.reset()
  }

  return (
    <>
      <div className="bg-background border-2 rounded-md text-sm">
        <div className="flex justify-end">
          <div className="draggable absolute right-8 w-full h-[28px]"></div>
          <X
            onClick={() => { closeWindow() }}
            className="m-2 hover:bg-red-500" />
        </div>
        <div className="px-6 pb-3">
          <p className="text-lg font-medium">
            {Id == "" ? "New Prompt" : "Edit Prompt"}
          </p>
          <span className="text-sm text-muted-foreground">
            {Id == "" ? "Create a prompt here" : "Make changes to your prompt here"}. Click save when you're done.
          </span>
        </div>
        <div className="flex px-6 pb-6">
          <Form {...promptForm}>
            <form onSubmit={promptForm.handleSubmit(onSubmit)} className="space-y-4 w-full">
              <FormField
                control={promptForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Title" {...field} className="text-sm" />
                    </FormControl>
                    <FormDescription>
                      This is your prompt title.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={promptForm.control}
                name="instructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Instructions</FormLabel>
                    <FormControl>
                      <Textarea rows={7} placeholder="" {...field} className="text-sm resize-none" />
                    </FormControl>
                    <FormDescription>
                      This is your prompt content.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={promptForm.control}
                name="default"
                render={({ field }) => (
                  <FormItem className="flex">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        name={field.name}
                      />
                    </FormControl>
                    <div>
                      <FormLabel className="text-sm">Set this prompt as default</FormLabel>
                      <FormDescription className="text-muted-foreground text-sm">
                        You can change default prompts at any time.
                      </FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2">
                {/* <Button variant="outline" onClick={() => { closeWindow() }}>Cancel</Button> */}
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </Form>
        </div>
      </div >
      {/* <div className="bg-background rounded-b-xl rounded-tr-xl" autoFocus></div> */}
      {/* <FormField
        control={promptForm.control}
        name="title"
        render={({ field }) => (
          <>
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          </>

        )}
      /> */}
    </>
  )
}



