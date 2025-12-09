import { cn } from '@/lib/utils';
import { marked } from 'marked';
import React, { memo, useId, useMemo } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import { CodeBlock, CodeBlockCode } from './code-block';
import { Badge } from './badge';
import { SELECTED_ELEMENT_TEXT } from '@/constants/selected-element-indicator.text-map';

export type MarkdownProps = {
  children: string;
  id?: string;
  className?: string;
  components?: Partial<Components>;
};

function parseMarkdownIntoBlocks(markdown: string): string[] {
  const tokens = marked.lexer(markdown);
  return tokens.map(token => token.raw);
}

function extractLanguage(className?: string): string {
  if (!className) return 'plaintext';
  const match = className.match(/language-(\w+)/);
  return match ? match[1] : 'plaintext';
}

type ContentPart = {
  type: 'markdown' | 'badge';
  content: string;
  elementType?: string;
};

function processSelectedElements(content: string): ContentPart[] {
  const parts: ContentPart[] = [];
  const selectedElementRegex =
    /<selected-element>([\s\S]*?)<\/selected-element>/g;
  let lastIndex = 0;
  let match;

  while ((match = selectedElementRegex.exec(content)) !== null) {
    // Add markdown content before the selected-element tag
    if (match.index > lastIndex) {
      parts.push({
        type: 'markdown',
        content: content.slice(lastIndex, match.index)
      });
    }

    // Extract content from selected-element tag
    const elementContent = match[1].trim();
    const typeMatch = elementContent.match(/Type:\s*(\w+)/);
    const codeMatch = elementContent.match(/Code:\s*(.+)/);

    const elementType = typeMatch ? typeMatch[1] : 'container';
    const elementCode = codeMatch ? codeMatch[1].trim() : '';

    // Add badge part
    parts.push({
      type: 'badge',
      content: elementCode,
      elementType
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining markdown content
  if (lastIndex < content.length) {
    parts.push({
      type: 'markdown',
      content: content.slice(lastIndex)
    });
  }

  // If no selected-element tags found, return the whole content as markdown
  if (parts.length === 0) {
    parts.push({
      type: 'markdown',
      content
    });
  }

  return parts;
}

const INITIAL_COMPONENTS: Partial<Components> = {
  code: function CodeComponent({ className, children, ...props }) {
    const isInline =
      !props.node?.position?.start.line ||
      props.node?.position?.start.line === props.node?.position?.end.line;

    if (isInline) {
      return (
        <span
          className={cn(
            'bg-primary-foreground rounded-sm px-1 font-mono text-sm',
            className
          )}
          {...props}
        >
          {children}
        </span>
      );
    }

    const language = extractLanguage(className);

    return (
      <CodeBlock className={className}>
        <CodeBlockCode code={children as string} language={language} />
      </CodeBlock>
    );
  },
  pre: function PreComponent({ children }) {
    return <>{children}</>;
  }
};

const MemoizedMarkdownBlock = memo(
  function MarkdownBlock({
    content,
    components = INITIAL_COMPONENTS
  }: {
    content: string;
    components?: Partial<Components>;
  }) {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    );
  },
  function propsAreEqual(prevProps, nextProps) {
    return prevProps.content === nextProps.content;
  }
);

MemoizedMarkdownBlock.displayName = 'MemoizedMarkdownBlock';

function MarkdownComponent({
  children,
  id,
  className,
  components = INITIAL_COMPONENTS
}: MarkdownProps) {
  const generatedId = useId();
  const blockId = id ?? generatedId;

  // Process content to extract selected-element tags
  const contentParts = useMemo(
    () => processSelectedElements(children),
    [children]
  );

  return (
    <div className={className}>
      {contentParts.map((part, partIndex) => {
        if (part.type === 'badge') {
          const elementTypeLabel =
            SELECTED_ELEMENT_TEXT.elementTypes[
              part.elementType as keyof typeof SELECTED_ELEMENT_TEXT.elementTypes
            ] ||
            part.elementType ||
            'Element';

          return (
            <Badge
              key={`${blockId}-badge-${partIndex}`}
              variant="selected"
              className="mb-2 gap-1"
            >
              <span className="text-xs">{elementTypeLabel}</span>
            </Badge>
          );
        }

        // Process markdown content
        const blocks = parseMarkdownIntoBlocks(part.content);
        return (
          <React.Fragment key={`${blockId}-markdown-${partIndex}`}>
            {blocks.map((block, blockIndex) => (
              <MemoizedMarkdownBlock
                key={`${blockId}-block-${partIndex}-${blockIndex}`}
                content={block}
                components={components}
              />
            ))}
          </React.Fragment>
        );
      })}
    </div>
  );
}

const Markdown = memo(MarkdownComponent);
Markdown.displayName = 'Markdown';

export { Markdown };
