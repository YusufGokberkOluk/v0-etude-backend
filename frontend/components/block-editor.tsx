"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSocket } from '@/hooks/use-socket';
import { apiClient } from '@/lib/api';
import { 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  Heading3,
  List, 
  ListOrdered, 
  Code, 
  Quote, 
  Image as ImageIcon,
  Plus,
  Trash2,
  GripVertical,
  MessageSquare,
  CheckSquare
} from 'lucide-react';

interface Block {
  _id: string;
  type: string;
  content: any;
  order: number;
  parent?: string;
  children?: Block[];
}

interface BlockEditorProps {
  pageId: string;
  initialBlocks?: Block[];
  onSave?: (blocks: Block[]) => void;
  readOnly?: boolean;
}

const BlockEditor: React.FC<BlockEditorProps> = ({
  pageId,
  initialBlocks = [],
  onSave,
  readOnly = false
}) => {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const { 
    isConnected, 
    joinPage, 
    leavePage, 
    updateBlock, 
    createBlock, 
    deleteBlock, 
    reorderBlocks,
    startTyping, 
    stopTyping,
    on, 
    off 
  } = useSocket({ token });

  // Join page for real-time collaboration
  useEffect(() => {
    if (isConnected && pageId) {
      joinPage(pageId);
      
      // Listen for real-time updates
      on('block-updated', handleRemoteBlockUpdate);
      on('block-created', handleRemoteBlockCreate);
      on('block-deleted', handleRemoteBlockDelete);
      on('blocks-reordered', handleRemoteBlocksReorder);
      on('user-typing', handleUserTyping);
      
      return () => {
        leavePage(pageId);
        off('block-updated', handleRemoteBlockUpdate);
        off('block-created', handleRemoteBlockCreate);
        off('block-deleted', handleRemoteBlockDelete);
        off('blocks-reordered', handleRemoteBlocksReorder);
        off('user-typing', handleUserTyping);
      };
    }
  }, [isConnected, pageId]);

  // Load blocks from API
  useEffect(() => {
    loadBlocks();
  }, [pageId]);

  const loadBlocks = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getBlocks(pageId);
      if (response.success) {
        setBlocks(response.data || []);
      }
    } catch (error) {
      console.error('Error loading blocks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Real-time event handlers
  const handleRemoteBlockUpdate = useCallback((data: any) => {
    setBlocks(prev => prev.map(block => 
      block._id === data.blockId 
        ? { ...block, content: data.content, type: data.type }
        : block
    ));
  }, []);

  const handleRemoteBlockCreate = useCallback((data: any) => {
    setBlocks(prev => [...prev, data.blockData]);
  }, []);

  const handleRemoteBlockDelete = useCallback((data: any) => {
    setBlocks(prev => prev.filter(block => block._id !== data.blockId));
  }, []);

  const handleRemoteBlocksReorder = useCallback((data: any) => {
    setBlocks(data.blocks);
  }, []);

  const handleUserTyping = useCallback((data: any) => {
    // Show typing indicator
    console.log(`${data.user.username} is typing...`);
  }, []);

  // Block operations
  const createNewBlock = async (type: string, afterBlockId?: string) => {
    try {
      const newBlock = {
        type,
        content: type === 'text' ? { text: '' } : {},
        order: 0
      };

      const response = await apiClient.createBlock(pageId, newBlock);
      if (response.success) {
        const createdBlock = response.data;
        setBlocks(prev => [...prev, createdBlock]);
        
        // Emit real-time event
        createBlock(pageId, createdBlock);
        
        return createdBlock;
      }
    } catch (error) {
      console.error('Error creating block:', error);
    }
  };

  const updateBlockContent = async (blockId: string, content: any) => {
    try {
      const response = await apiClient.updateBlock(blockId, { content });
      if (response.success) {
        setBlocks(prev => prev.map(block => 
          block._id === blockId 
            ? { ...block, content }
            : block
        ));
        
        // Emit real-time event
        updateBlock(pageId, blockId, content, blocks.find(b => b._id === blockId)?.type || 'text');
      }
    } catch (error) {
      console.error('Error updating block:', error);
    }
  };

  const deleteBlockById = async (blockId: string) => {
    try {
      const response = await apiClient.deleteBlock(blockId);
      if (response.success) {
        setBlocks(prev => prev.filter(block => block._id !== blockId));
        
        // Emit real-time event
        deleteBlock(pageId, blockId);
      }
    } catch (error) {
      console.error('Error deleting block:', error);
    }
  };

  // Typing indicator
  const handleBlockChange = (blockId: string, content: any) => {
    // Start typing indicator
    startTyping(pageId);
    
    // Clear previous timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    // Set new timeout
    const timeout = setTimeout(() => {
      stopTyping(pageId);
      updateBlockContent(blockId, content);
    }, 1000);
    
    setTypingTimeout(timeout);
    
    // Update local state immediately
    setBlocks(prev => prev.map(block => 
      block._id === blockId 
        ? { ...block, content }
        : block
    ));
  };

  // Render block content based on type
  const renderBlockContent = (block: Block) => {
    const isSelected = selectedBlockId === block._id;
    
    switch (block.type) {
      case 'text':
        return (
          <div className="relative group">
            <textarea
              value={block.content.text || ''}
              onChange={(e) => handleBlockChange(block._id, { text: e.target.value })}
              className="w-full min-h-[1.5em] p-2 border-none outline-none resize-none bg-transparent"
              placeholder="Type '/' for commands..."
              readOnly={readOnly}
              onFocus={() => setSelectedBlockId(block._id)}
              onBlur={() => setSelectedBlockId(null)}
            />
            {isSelected && !readOnly && (
              <div className="absolute -left-8 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
              </div>
            )}
          </div>
        );
        
      case 'heading1':
        return (
          <div className="relative group">
            <input
              type="text"
              value={block.content.text || ''}
              onChange={(e) => handleBlockChange(block._id, { text: e.target.value })}
              className="w-full text-3xl font-bold p-2 border-none outline-none bg-transparent"
              placeholder="Heading 1"
              readOnly={readOnly}
              onFocus={() => setSelectedBlockId(block._id)}
              onBlur={() => setSelectedBlockId(null)}
            />
            {isSelected && !readOnly && (
              <div className="absolute -left-8 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
              </div>
            )}
          </div>
        );
        
      case 'heading2':
        return (
          <div className="relative group">
            <input
              type="text"
              value={block.content.text || ''}
              onChange={(e) => handleBlockChange(block._id, { text: e.target.value })}
              className="w-full text-2xl font-semibold p-2 border-none outline-none bg-transparent"
              placeholder="Heading 2"
              readOnly={readOnly}
              onFocus={() => setSelectedBlockId(block._id)}
              onBlur={() => setSelectedBlockId(null)}
            />
            {isSelected && !readOnly && (
              <div className="absolute -left-8 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
              </div>
            )}
          </div>
        );
        
      case 'heading3':
        return (
          <div className="relative group">
            <input
              type="text"
              value={block.content.text || ''}
              onChange={(e) => handleBlockChange(block._id, { text: e.target.value })}
              className="w-full text-xl font-medium p-2 border-none outline-none bg-transparent"
              placeholder="Heading 3"
              readOnly={readOnly}
              onFocus={() => setSelectedBlockId(block._id)}
              onBlur={() => setSelectedBlockId(null)}
            />
            {isSelected && !readOnly && (
              <div className="absolute -left-8 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
              </div>
            )}
          </div>
        );
        
      case 'list':
        return (
          <div className="relative group flex items-start">
            <div className="w-4 h-4 rounded-full border-2 border-gray-300 mt-2 mr-2 flex-shrink-0" />
            <input
              type="text"
              value={block.content.text || ''}
              onChange={(e) => handleBlockChange(block._id, { text: e.target.value })}
              className="flex-1 p-2 border-none outline-none bg-transparent"
              placeholder="List item"
              readOnly={readOnly}
              onFocus={() => setSelectedBlockId(block._id)}
              onBlur={() => setSelectedBlockId(null)}
            />
            {isSelected && !readOnly && (
              <div className="absolute -left-8 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
              </div>
            )}
          </div>
        );
        
      case 'code':
        return (
          <div className="relative group">
            <pre className="bg-gray-100 p-4 rounded-md font-mono text-sm">
              <textarea
                value={block.content.code || ''}
                onChange={(e) => handleBlockChange(block._id, { code: e.target.value })}
                className="w-full min-h-[100px] bg-transparent border-none outline-none resize-none font-mono"
                placeholder="Enter code..."
                readOnly={readOnly}
                onFocus={() => setSelectedBlockId(block._id)}
                onBlur={() => setSelectedBlockId(null)}
              />
            </pre>
            {isSelected && !readOnly && (
              <div className="absolute -left-8 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
              </div>
            )}
          </div>
        );
        
      case 'quote':
        return (
          <div className="relative group border-l-4 border-gray-300 pl-4 italic">
            <textarea
              value={block.content.text || ''}
              onChange={(e) => handleBlockChange(block._id, { text: e.target.value })}
              className="w-full min-h-[1.5em] p-2 border-none outline-none resize-none bg-transparent italic"
              placeholder="Quote"
              readOnly={readOnly}
              onFocus={() => setSelectedBlockId(block._id)}
              onBlur={() => setSelectedBlockId(null)}
            />
            {isSelected && !readOnly && (
              <div className="absolute -left-8 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
              </div>
            )}
          </div>
        );
        
      default:
        return (
          <div className="p-2 text-gray-500">
            Unknown block type: {block.type}
          </div>
        );
    }
  };

  // Block toolbar
  const BlockToolbar: React.FC<{ block: Block }> = ({ block }) => {
    if (readOnly) return null;
    
    return (
      <div className="absolute -left-12 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
        <button
          onClick={() => createNewBlock('text', block._id)}
          className="p-1 hover:bg-gray-200 rounded"
          title="Add text block"
        >
          <Plus className="h-3 w-3" />
        </button>
        <button
          onClick={() => deleteBlockById(block._id)}
          className="p-1 hover:bg-gray-200 rounded text-red-500"
          title="Delete block"
        >
          <Trash2 className="h-3 w-3" />
        </button>
        <button
          onClick={() => {/* TODO: Add comment */}}
          className="p-1 hover:bg-gray-200 rounded"
          title="Add comment"
        >
          <MessageSquare className="h-3 w-3" />
        </button>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="space-y-2">
        {blocks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No content yet. Start typing to create your first block.</p>
            {!readOnly && (
              <button
                onClick={() => createNewBlock('text')}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add your first block
              </button>
            )}
          </div>
        ) : (
          blocks.map((block) => (
            <div key={block._id} className="relative group">
              {renderBlockContent(block)}
              <BlockToolbar block={block} />
            </div>
          ))
        )}
      </div>
      
      {/* Block type selector */}
      {selectedBlockId && !readOnly && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white border rounded-lg shadow-lg p-2 flex gap-2">
          <button
            onClick={() => {/* TODO: Change block type */}}
            className="p-2 hover:bg-gray-100 rounded"
            title="Text"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            onClick={() => {/* TODO: Change block type */}}
            className="p-2 hover:bg-gray-100 rounded"
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </button>
          <button
            onClick={() => {/* TODO: Change block type */}}
            className="p-2 hover:bg-gray-100 rounded"
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => {/* TODO: Change block type */}}
            className="p-2 hover:bg-gray-100 rounded"
            title="List"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => {/* TODO: Change block type */}}
            className="p-2 hover:bg-gray-100 rounded"
            title="Code"
          >
            <Code className="h-4 w-4" />
          </button>
          <button
            onClick={() => {/* TODO: Change block type */}}
            className="p-2 hover:bg-gray-100 rounded"
            title="Quote"
          >
            <Quote className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default BlockEditor; 