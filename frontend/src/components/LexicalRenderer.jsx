import React from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import { CodeNode, CodeHighlightNode } from '@lexical/code';
import { TableNode, TableCellNode, TableRowNode } from '@lexical/table';

const theme = {
  ltr: 'ltr',
  rtl: 'rtl',
  paragraph: 'editor-paragraph mb-2',
  quote: 'border-l-4 border-gray-300 pl-4 italic my-2 text-gray-600',
  heading: {
    h1: 'text-3xl font-bold my-4',
    h2: 'text-2xl font-bold my-3',
    h3: 'text-xl font-bold my-2',
    h4: 'text-lg font-bold my-2',
    h5: 'text-base font-bold my-1',
    h6: 'text-sm font-bold my-1',
  },
  list: {
    ol: 'list-decimal pl-6 mb-2',
    ul: 'list-disc pl-6 mb-2',
    listitem: 'mb-1',
  },
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
    underlineStrikethrough: 'underline line-through',
    code: 'bg-gray-100 font-mono px-1 rounded text-sm',
  },
  code: 'bg-gray-100 font-mono block p-3 rounded my-2 text-sm overflow-x-auto',
};

const NODES = [
  HeadingNode,
  ListNode,
  ListItemNode,
  QuoteNode,
  CodeNode,
  CodeHighlightNode,
  TableNode,
  TableCellNode,
  TableRowNode,
  AutoLinkNode,
  LinkNode,
];

export default function LexicalRenderer({ content, className = '' }) {
  const isLexicalJson = React.useMemo(() => {
    if (!content) return false;
    try {
      const parsed = JSON.parse(content);
      return parsed && parsed.root !== undefined;
    } catch {
      return false;
    }
  }, [content]);

  if (!isLexicalJson) {
    return (
      <div className={`text-gray-800 leading-relaxed whitespace-pre-wrap ${className}`}>
        {content}
      </div>
    );
  }

  const initialConfig = {
    namespace: 'BlogRenderer',
    theme,
    editable: false,
    editorState: content,
    onError(error) {
      console.error(error);
    },
    nodes: NODES,
  };

  return (
    <LexicalComposer key={content} initialConfig={initialConfig}>
      <div className={`lexical-renderer text-gray-800 leading-relaxed ${className}`}>
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="outline-none cursor-default" />
          }
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>
    </LexicalComposer>
  );
}

export function extractPlainText(content) {
  if (!content) return '';
  try {
    const parsed = JSON.parse(content);
    if (!parsed || parsed.root === undefined) return content;
    const getText = (node) => {
      if (node.type === 'text') return node.text || '';
      if (node.children) return node.children.map(getText).join(' ');
      return '';
    };
    return getText(parsed.root).trim();
  } catch {
    return content;
  }
}
