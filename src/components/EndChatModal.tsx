interface EndChatModalProps {
  onConfirm: (accepted: boolean) => void;
}

export default function EndChatModal({ onConfirm }: EndChatModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">End Chat?</h2>
        <p className="mb-4">Are you sure you want to end this chat?</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => onConfirm(false)}
            className="px-4 py-2 bg-gray-300 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(true)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            End Chat
          </button>
        </div>
      </div>
    </div>
  );
}