
import { cn } from '@/lib/utils';
import { useEditor, EditorContext, EditorContent, Extension } from '@tiptap/react';
import { Placeholder } from '@tiptap/extensions';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from '@tiptap/markdown';
import { useMemo } from 'react';

interface TiptapEditorProps {
    className?: string;
    placeholder?: string;
    // context: string;
    setContext: React.Dispatch<React.SetStateAction<string>>
}

export default function TiptapEditor({ className, placeholder, setContext }: TiptapEditorProps) {

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
            Placeholder.configure({
                placeholder: placeholder,
            }),
        ],
        autofocus: true,
        editorProps: {
            attributes: {
                class: cn(
                    "p-0.5 rounded-xs min-h-4 text-foreground max-w-full",
                    "prose prose-xs md:prose-sm prose-blockquote:text-foreground prose-blockquote:m-1 prose-blockquote:opacity-70 prose-ul:m-0 prose-li:m-0 prose-ol:m-0 prose-pre:m-1 prose-pre:p-1 prose-pre:text-sm prose-p:m-0"
                ),
            },
        },
        onUpdate: ({ editor }) => {
            setContext(editor.getMarkdown());
        },
    })

    // Memoize the provider value to avoid unnecessary re-renders
    const providerValue = useMemo(() => ({ editor }), [editor])

    return (
        <>
        <div className={cn(className, "flex-1 opacity-90 p-0.5 m-1 max-h-60 overflow-y-auto")}>
            <EditorContext.Provider value={providerValue}>
                <EditorContent
                    autoFocus
                    editor={editor}
                    />
            </EditorContext.Provider>
        </div>
                    </>
    )
}