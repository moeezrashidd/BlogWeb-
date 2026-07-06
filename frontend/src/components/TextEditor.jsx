import React from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { LinkNode } from '@lexical/link';
import { CodeNode, CodeHighlightNode } from '@lexical/code';
import { TableNode, TableCellNode, TableRowNode } from '@lexical/table';
import { AutoLinkNode } from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FORMAT_TEXT_COMMAND, FORMAT_ELEMENT_COMMAND, UNDO_COMMAND, REDO_COMMAND } from 'lexical';
import { Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, AlignJustify, Undo, Redo } from 'lucide-react';

const theme = {
  ltr: 'ltr',
  rtl: 'rtl',
  placeholder: 'editor-placeholder',
  paragraph: 'editor-paragraph mb-2',
  quote: 'editor-quote border-l-4 border-gray-300 pl-4 italic my-2',
  heading: {
    h1: 'text-3xl font-bold my-4',
    h2: 'text-2xl font-bold my-3',
    h3: 'text-xl font-bold my-2',
    h4: 'text-lg font-bold my-2',
    h5: 'text-base font-bold my-1',
    h6: 'text-sm font-bold my-1',
  },
  list: {
    ol: 'list-decimal pl-5 mb-2',
    ul: 'list-disc pl-5 mb-2',
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

const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();

  return (
    <div className="flex flex-wrap gap-2 p-2 border-b border-gray-300 bg-gray-50 rounded-t-lg items-center">
      <button type="button" onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)} className="p-1.5 hover:bg-gray-200 rounded text-gray-700 transition">
        <Undo size={18} />
      </button>
      <button type="button" onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)} className="p-1.5 hover:bg-gray-200 rounded text-gray-700 transition">
        <Redo size={18} />
      </button>
      
      <div className="w-px h-6 bg-gray-300 mx-1"></div>
      
      <button type="button" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')} className="p-1.5 hover:bg-gray-200 rounded text-gray-700 transition">
        <Bold size={18} />
      </button>
      <button type="button" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')} className="p-1.5 hover:bg-gray-200 rounded text-gray-700 transition">
        <Italic size={18} />
      </button>
      <button type="button" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')} className="p-1.5 hover:bg-gray-200 rounded text-gray-700 transition">
        <Underline size={18} />
      </button>
      <button type="button" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')} className="p-1.5 hover:bg-gray-200 rounded text-gray-700 transition">
        <Strikethrough size={18} />
      </button>
      
      <div className="w-px h-6 bg-gray-300 mx-1"></div>
      
      <button type="button" onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')} className="p-1.5 hover:bg-gray-200 rounded text-gray-700 transition">
        <AlignLeft size={18} />
      </button>
      <button type="button" onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')} className="p-1.5 hover:bg-gray-200 rounded text-gray-700 transition">
        <AlignCenter size={18} />
      </button>
      <button type="button" onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')} className="p-1.5 hover:bg-gray-200 rounded text-gray-700 transition">
        <AlignRight size={18} />
      </button>
      <button type="button" onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')} className="p-1.5 hover:bg-gray-200 rounded text-gray-700 transition">
        <AlignJustify size={18} />
      </button>
    </div>
  );
};

const OnChangePlugin = ({ onChange }) => {
  const [editor] = useLexicalComposerContext();
  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    return editor.registerUpdateListener(({ editorState, dirtyElements, dirtyLeaves }) => {
      // Skip the initial mount update (empty state) so we don't overwrite content with an empty JSON blob
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }
      editorState.read(() => {
        const json = editorState.toJSON();
        onChange(JSON.stringify(json));
      });
    });
  }, [editor, onChange]);
  return null;
};

export default function TextEditor({ value, onChange }) {
  const initialConfig = {
    namespace: 'BlogEditor',
    theme,
    onError(error) {
      console.error(error);
    },
    nodes: [
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
      LinkNode
    ]
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition">
        <ToolbarPlugin />
        <div className="relative bg-white p-4 min-h-[250px]">
          <RichTextPlugin
            contentEditable={<ContentEditable className="outline-none min-h-[250px] text-gray-700" />}
            placeholder={<div className="absolute top-4 left-4 text-gray-400 pointer-events-none">Write your post content here...</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <OnChangePlugin onChange={onChange} />
        </div>
      </div>
    </LexicalComposer>
  );
}
