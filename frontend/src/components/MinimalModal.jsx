export default function MinimalModal({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
