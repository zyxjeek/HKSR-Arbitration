import ReactMarkdown from "react-markdown";

interface MarkdownContentProps {
  children: string;
  className?: string;
}

export function MarkdownContent({ children, className = "" }: MarkdownContentProps) {
  return (
    <div className={`prose-notice ${className}`.trim()}>
      <ReactMarkdown
        components={{
          a: (props) => (
            <a {...props} target="_blank" rel="noreferrer noopener" />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
