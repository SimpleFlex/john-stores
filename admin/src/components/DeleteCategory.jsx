const DeleteCategory = ({
  onClose,
  onConfirm,
  isLoading = false,
  categoryName = "",
}) => {
  return (
    <div className="flex flex-col items-start w-97.5 p-6.25 gap-2 rounded-2xl bg-white">
      <div className="flex flex-col items-end self-stretch gap-4">
        <div className="flex flex-col items-start gap-1">
          <p className="text-[#2D2D2D] font-medium text-base leading-4.5 font-clash-grotesk">
            Delete Category
          </p>
          <p className="text-[#717182] font-normal text-sm leading-6 font-dm-sans">
            Are you sure you want to delete{" "}
            {categoryName ? `"${categoryName}"` : "this category"}? This action
            cannot be undone.
          </p>
        </div>

        <div className="flex gap-1">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex justify-center items-center px-5 h-11.25 rounded-xl bg-[#ECECF0] disabled:opacity-50"
          >
            <p className="text-[#0A0A0A] text-center font-medium text-sm leading-4 font-clash-grotesk">
              Cancel
            </p>
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex justify-center items-center px-5 h-11.25 rounded-xl bg-[#D4183D] disabled:opacity-50"
          >
            <p className="text-white text-center font-medium text-sm leading-4 font-clash-grotesk">
              {isLoading ? "Deleting..." : "Delete"}
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCategory;
