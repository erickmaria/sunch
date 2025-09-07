import Markdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
// import rehypeKatex from 'rehype-katex';

interface MarkProps {
    markdown: string
}

export default function MarkdownHighlighter({ markdown }: MarkProps) {

    return (
        <div className='my-2 mx-6'>
            <div className="max-w-none prose prose-pre:m-0 prose-pre:p-0 prose-sm dark:prose-invert prose-hr:prose-invert prose-hr:my-6">
                <Markdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                        code({ node, className, children: codeChildren, ...props }) {
                            const match = /language-(\w+)/.exec(className || "");

                            return match ? (
                                <SyntaxHighlighter
                                    style={oneDark}
                                    PreTag="div"
                                    language={match[1]}
                                    
                                //   {...props}
                                >
                                    {String(codeChildren).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                            ) : (
                                <code className={className} {...props} > 
                                    {codeChildren}
                                </code>
                            );
                        },

                        p({ node, children, ...props }) {
                          return (
                            <p
                              style={{ marginBottom: "0.5rem", whiteSpace: "pre-line" }}
                              {...props}
                            >
                              {children}
                            </p>
                          );
                        },
                    }}
                >
                    {markdown}
                </Markdown>
            </div>
        </div>
    )
}
