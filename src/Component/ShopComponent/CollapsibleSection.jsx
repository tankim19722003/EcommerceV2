import { ChevronDown, ChevronUp } from "lucide-react";

// Collapsible Section Component
const CollapsibleSection = ({ title, children, isOpen, toggle }) => (
  <div className="mb-4 rounded-md bg-white border border-gray-200 shadow-md">
    <button
      type="button"
      className={`flex w-full items-center justify-between px-4 py-2 text-left text-base font-medium transition-colors duration-150 ${
        isOpen
          ? "bg-teal-500 text-white shadow"
          : "text-gray-800 hover:bg-gray-100 hover:text-teal-600"
      }`}
      onClick={toggle}
      aria-expanded={isOpen}
    >
      <span>{title}</span>
      {isOpen ? (
        <ChevronUp size={20} className="text-white" />
      ) : (
        <ChevronDown size={20} className="text-teal-600" />
      )}
    </button>
    {isOpen && (
      <div className="p-4 bg-white border-t border-gray-200">{children}</div>
    )}
  </div>
);



export default CollapsibleSection;