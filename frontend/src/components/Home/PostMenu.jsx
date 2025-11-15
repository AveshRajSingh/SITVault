import React, { useEffect } from 'react';
import { FaEllipsisV, FaTrash, FaEdit, FaMagic } from 'react-icons/fa';
import { usePostUI } from '../../context/PostUIContext';

const PostMenu = ({ post }) => {
  const { openMenuPostId, toggleMenu, closeMenu, canEditPost, canDeletePost, requestEdit, requestDelete, requestAskAI } = usePostUI();

  // Close on ESC
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeMenu();
    };
    if (openMenuPostId === post._id) {
      window.addEventListener('keydown', onKeyDown);
    }
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [openMenuPostId, post._id, closeMenu]);

  // Show menu if user can edit/delete OR always show for Ask AI
  const showMenu = canDeletePost(post) || canEditPost(post);

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleMenu(post._id);
        }}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
      >
        <FaEllipsisV className="text-gray-500" size={14} />
      </button>

      {openMenuPostId === post._id && (
  <div
          className="absolute z-50 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[140px] animate-fade-in"
        >
          {/* Ask AI - Available to everyone */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              requestAskAI(post);
              closeMenu();
            }}
            className="w-full flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 transition-colors text-sm cursor-pointer"
          >
            <FaMagic size={12} />
            <span>Ask AI</span>
          </button>

          {showMenu && canEditPost(post) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                requestEdit(post);
                closeMenu();
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 transition-colors text-sm cursor-pointer"
            >
              <FaEdit size={12} />
              <span>Edit</span>
            </button>
          )}

          {showMenu && canDeletePost(post) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                requestDelete(post._id);
                closeMenu();
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors text-sm cursor-pointer"
            >
              <FaTrash size={12} />
              <span>Delete</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PostMenu;