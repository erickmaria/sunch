
import { LLMProvider, LLMResponses } from '@/services/LLMService'
import React from 'react'
import { Message, MessageContent, MessageResponse } from '../ai-elements/message'

interface ResultProps {
  contents: LLMResponses | undefined
}

function Result({ contents }: ResultProps) {

//   const markdownContent = `# Markdown Example

// ### 1. Lists
// *   **Unordered List**
//     *   Sub-point A
//     *   Sub-point B
// *   **Ordered List**
//     1.  First item
//     2.  Second item

// ### 2. Code Blocks
// \`\`\`javascript
// def greet(name):
//     print(f"Hello, {name}!")

// greet("Markdown User")
// \`\`\`

// ### 3. Tables


// | Feature | Support | Efficiency |
// | :--- | :---: | :---: |
// | Plain Text | High | Excellent |
// | Images | Yes | Good |
// | Formatting | Native | High |

// ### 4. Text Formatting
// *   **Bold** or *Italics*
// *   [Hyperlinks](https://markdownguide.org)
// *   > Blockquotes for highlighting specific statements.`;

//   contents = new Map<LLMProvider, string>([
//     ["claude" as LLMProvider, markdownContent]
//   ]);

  if (contents != undefined && contents.size > 0) {
    const providers = Array.from(contents.keys())
    return (

      <div className="bg-background/15 p-6  max-h-[400px] overflow-auto rounded-b-md mt-0.5 select-text">
        <div className="flex flex-coloverflow-auto">
          {providers.map((provider: LLMProvider) => (
            <Message key={provider} from='assistant'>
              <MessageContent>
                <MessageResponse
                linkSafety={{
                  enabled: false,
                }}
                >{contents.get(provider)!}</MessageResponse>
              </MessageContent>
            </Message>
         ))}
      </div>
    </div >
    )
  }

  return (
    <></>
  )
}

export default React.memo(Result)
