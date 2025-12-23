
import { cn } from '@/lib/utils';
import { useEditor, EditorContext, EditorContent, Extension } from '@tiptap/react';
import { Dropcursor, Placeholder } from '@tiptap/extensions';
import { StarterKit } from '@tiptap/starter-kit';
import { Markdown } from '@tiptap/markdown';
import { useEffect, useMemo, useState } from 'react';
import { EditorMode } from '@/models/editor';
import { useUserSettings } from '@/hooks/useUserSettings';

type TiptapEditorProps = React.ComponentPropsWithoutRef<'div'> & {
    className?: string;
    placeholder?: string;
    content: string;
    setContent: React.Dispatch<React.SetStateAction<string>>
    setEnter: React.Dispatch<React.SetStateAction<boolean>>
}

export default function TiptapEditor({ className, placeholder, content, setContent, setEnter, ...props }: TiptapEditorProps) {

    const { getConfig } = useUserSettings();

    const [editorMode] = useState<EditorMode>(getConfig("general.editor.mode"));

    useEffect(() => {
        if (content.length == 0) editor.commands.clearContent()
    }, [content]);

    // sync configs
    useEffect(() => {
        const removeListener = window.system.syncConfig((data) => {
            if (data.key === `general.editor.mode`) {
                editor?.view.updateState(editor.state);
            }
        });

        return () => {
            removeListener();
        };
    });

    const OverrideShortcuts = Extension.create({
        name: 'override',
        addKeyboardShortcuts() {
            return {
                Enter: () => {
                    setEnter(true)
                    return true;
                },
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
                'Control-Enter': () => this.editor.commands.setHardBreak()
            };
        },
    });

    const editor = useEditor({
        enableInputRules: editorMode == "markdown" && true,
        enablePasteRules: editorMode == "markdown" && true,

        extensions: [
            StarterKit.configure({
                dropcursor: false,
                heading: false,
                trailingNode: false
                // hardBreak: false,
            }),
            Markdown,
            OverrideShortcuts,
            Placeholder.configure({
                placeholder: placeholder,
            })
        ],
        autofocus: true,
        editorProps: {
            attributes: {
                class: cn(
                    "p-0.5 rounded-xs min-h-4 text-foreground max-w-full",
                    "prose prose-xs md:prose-sm prose-blockquote:text-foreground prose-blockquote:m-1 prose-blockquote:opacity-70 prose-ul:m-0 prose-li:m-0 prose-li:p-0 prose-ol:m-0 prose-pre:m-1",
                    "prose-pre:p-1 prose-pre:text-sm prose-p:m-0 not-pre-code prose-code:text-primary prose-pre:bg-secondary"
                ),
            },
        },
        onUpdate: ({ editor }) => {
            setContent(editor.getMarkdown());
        },
    })

    // Memoize the provider value to avoid unnecessary re-renders
    const providerValue = useMemo(() => ({ editor }), [editor])

    return (
        <div className={cn(className, "flex-1 opacity-90 p-0.5 m-1 max-h-60 overflow-y-auto ")}>
            <EditorContext.Provider value={providerValue}>
                <EditorContent
                    {...props}
                    autoFocus
                    editor={editor}
                />
            </EditorContext.Provider>
        </div>
    )
}