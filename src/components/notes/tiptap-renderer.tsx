import Image from 'next/image';
import React from 'react';

interface TiptapNode {
  type: string;
  attrs?: Record<string, any>;
  content?: TiptapNode[];
  text?: string;
  marks?: { type: string; attrs?: Record<string, any> }[];
}

function renderMarks(text: string, marks: TiptapNode['marks'] = []): React.ReactNode {
  return marks.reduce<React.ReactNode>((acc, mark) => {
    switch (mark.type) {
      case 'bold':
        return <strong>{acc}</strong>;
      case 'italic':
        return <em>{acc}</em>;
      case 'code':
        return <code className="px-1.5 py-0.5 rounded bg-muted text-accent text-[0.85em]">{acc}</code>;
      case 'link':
        return (
          <a
            href={typeof mark.attrs?.href === 'string' ? mark.attrs.href : '#'}
            target="_blank"
            rel="noreferrer"
            className="text-accent underline underline-offset-2"
          >
            {acc}
          </a>
        );
      case 'strike':
        return <s>{acc}</s>;
      default:
        return acc;
    }
  }, text);
}

function renderNode(node: TiptapNode, key: number): React.ReactNode {
  if (node.type === 'text') {
    return <React.Fragment key={key}>{renderMarks(node.text ?? '', node.marks)}</React.Fragment>;
  }

  const children = node.content?.map((child, i) => renderNode(child, i));

  switch (node.type) {
    case 'doc':
      return <div key={key}>{children}</div>;
    case 'paragraph':
      return (
        <p key={key} className="mb-4 leading-relaxed text-muted-foreground">
          {children}
        </p>
      );
    case 'heading': {
      const level = Math.min(Math.max(node.attrs?.level ?? 2, 1), 4);
      const Tag = (`h${level}` as unknown) as keyof JSX.IntrinsicElements;
      return (
        <Tag key={key} className="font-bold mt-8 mb-3 text-foreground">
          {children}
        </Tag>
      );
    }
    case 'bulletList':
      return (
        <ul key={key} className="list-disc pl-6 mb-4 space-y-1.5 text-muted-foreground">
          {children}
        </ul>
      );
    case 'orderedList':
      return (
        <ol key={key} className="list-decimal pl-6 mb-4 space-y-1.5 text-muted-foreground">
          {children}
        </ol>
      );
    case 'listItem':
      return <li key={key}>{children}</li>;
    case 'codeBlock':
      return (
        <pre key={key} className="glass-panel p-4 mb-4 overflow-x-auto text-sm font-mono">
          <code>{node.content?.map((c) => c.text).join('')}</code>
        </pre>
      );
    case 'blockquote':
      return (
        <blockquote key={key} className="border-l-2 border-accent pl-4 italic text-muted-foreground mb-4">
          {children}
        </blockquote>
      );
    case 'image':
      return (
        <span key={key} className="relative block w-full aspect-video my-6 rounded-xl overflow-hidden border border-border">
          <Image
            src={node.attrs?.src ?? ''}
            alt={node.attrs?.alt ?? ''}
            fill
            className="object-cover"
          />
        </span>
      );
    case 'table':
      return (
        <div key={key} className="overflow-x-auto mb-4">
          <table className="w-full border-collapse text-sm">
            <tbody>{children}</tbody>
          </table>
        </div>
      );
    case 'tableRow':
      return <tr key={key}>{children}</tr>;
    case 'tableCell':
    case 'tableHeader':
      return (
        <td key={key} className="border border-border px-3 py-2 text-muted-foreground">
          {children}
        </td>
      );
    case 'horizontalRule':
      return <hr key={key} className="border-border my-6" />;
    case 'hardBreak':
      return <br key={key} />;
    default:
      return <React.Fragment key={key}>{children}</React.Fragment>;
  }
}

export function TiptapRenderer({ content }: { content: Record<string, unknown> }) {
  if (!content || typeof content !== 'object') return null;
  return <div className="prose-content">{renderNode(content as unknown as TiptapNode, 0)}</div>;
}
