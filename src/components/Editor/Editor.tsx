
import { cn } from '@/lib/utils'
import { useEditor, EditorContext, EditorContent, Extension } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from '@tiptap/markdown';

import { useEffect, useMemo, useState } from 'react'

interface TiptapEditorProps {
    className?: string;
}

const TiptapEditor = ({ className }: TiptapEditorProps) => {


    const [editorContent, setEditorContent] = useState('');
    const OverrideShortcuts = Extension.create({
        name: 'override',
        addKeyboardShortcuts() {
            return {
                Enter: () => true,
                'Shift-Enter': ({ editor }) => {
                    return editor.commands.first(({ commands }) => [
                        () => commands.newlineInCode(), // Handle code blocks
                        // This is the critical line to add:
                        () => commands.splitListItem('listItem'), // Handles list items
                        () => commands.createParagraphNear(), // Fallback for general paragraphs
                        () => commands.liftEmptyBlock(),
                        () => commands.splitBlock(),
                    ]);
                },
                'Control-Enter': () => this.editor.commands.setHardBreak(),
            };
        },
    });

    const editor = useEditor({

        extensions: [
            StarterKit.configure({
                heading: false,
                trailingNode: false
                // hardBreak: false,
            }),
            Markdown,
            OverrideShortcuts,
        ],
        autofocus: true,
        editorProps: {
            attributes: {
                class: cn(
                    "bg-input/15 p-0.5 rounded-xs min-h-4 text-foreground max-w-full",
                    "prose prose-xs md:prose-sm prose-blockquote:text-foreground prose-blockquote:m-1 prose-blockquote:opacity-70 prose-ul:m-0 prose-li:m-0 prose-ol:m-0 prose-pre:m-1 prose-pre:p-1 prose-pre:text-sm prose-p:m-0"
                ),
            },
        },
        onUpdate: ({ editor }) => {

            setEditorContent(editor.getHTML());
        },
    })


    useEffect(() => {
        console.log(editorContent)
    })



    // Memoize the provider value to avoid unnecessary re-renders
    const providerValue = useMemo(() => ({ editor }), [editor])

    return (

        <div className={cn(className, "opacity-90 p-0.5 m-1 max-h-60 overflow-y-auto")}>
            <EditorContext.Provider value={providerValue}>
                <EditorContent
                    autoFocus
                    editor={editor}
                />
            </EditorContext.Provider>
        </div>
    )
}

export default TiptapEditor