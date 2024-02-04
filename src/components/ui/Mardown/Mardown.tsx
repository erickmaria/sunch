import Markdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { xonokai  } from 'react-syntax-highlighter/dist/esm/styles/prism'


interface MarkProps {
    markdown: string
}

export default function MarkdownHighlighter({ markdown }: MarkProps) {
    return (
        <Markdown
            children={markdown}
            components={{
                code(props) {

                    const { children, className, node, ...rest } = props
                    const match = /language-(\w+)/.exec(className || '')

                    return match ? (
                        <SyntaxHighlighter
                            PreTag="pre"
                            children={String(children).replace(/\n$/, '')}
                            language={match[1]}
                            style={xonokai}
                        />
                    ) : (
                        <code {...rest} className={className}>
                            {children}
                        </code>
                    )
                }
            }}
        />
    )
}
