import { useState, useEffect } from "react";
import { fetchEmails, deleteEmail } from "../services/api.service.js";

const EasyMedia = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);

  useEffect(() => {
    loadEmails();
  }, []);

  const loadEmails = async () => {
    setLoading(true);
    try {
      const data = await fetchEmails();
      setEmails(data.emails);
    } catch (error) {
      console.error("Failed to load emails:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setIsDeleting(id);
    try {
      await deleteEmail(id);
      setEmails((prev) => prev.filter((e) => e._id !== id));
    } catch (error) {
      console.error("Failed to delete email:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col justify-end items-center w-full pt-[25px] pb-[14px] px-[15px] gap-5 rounded-[25px] border border-[rgba(107,107,107,0.15)] bg-white">
        <div className="flex w-full items-center px-1">
          <p className="text-[#717182] font-medium text-sm lg:text-base leading-[25px] tracking-[-0.2px] capitalize font-dm-sans-500">
            {loading
              ? "Loading..."
              : `${emails.length} email${emails.length !== 1 ? "s" : ""} collected`}
          </p>
        </div>

        <div className="flex flex-col w-full gap-5 px-3 rounded-[18px] border border-[rgba(107,107,107,0.25)] bg-white">
          {/* Desktop Table */}
          <div className="hidden lg:block">
            <div className="flex px-[15px] w-full justify-between items-center bg-white">
              <div className="flex w-full justify-between items-start">
                <div className="flex items-center w-[168px] h-[65px] px-[2px]">
                  <p className="text-[#717182] font-medium text-[14px] leading-[14px] font-clash-grotesk">
                    Name
                  </p>
                </div>
                <div className="flex items-center w-[201px] h-[65px] px-[2px]">
                  <p className="text-[#717182] font-medium text-[14px] leading-[14px] font-clash-grotesk">
                    Email
                  </p>
                </div>
                <div className="flex items-center w-[143px] h-[65px] px-[2px]">
                  <p className="text-[#717182] font-medium text-[14px] leading-[14px] font-clash-grotesk">
                    Location
                  </p>
                </div>
                <div className="flex items-center w-[98px] h-[65px] px-[2px]">
                  <p className="text-[#717182] font-medium text-[14px] leading-[14px] font-clash-grotesk">
                    Actions
                  </p>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full border-2 border-[#032817] border-t-transparent animate-spin" />
                <p className="text-[#717182] font-dm-sans-500 text-sm">
                  Loading emails...
                </p>
              </div>
            </div>
          ) : emails.length === 0 ? (
            <div className="flex justify-center py-10">
              <p className="text-[#717182] font-dm-sans-500 text-sm">
                No emails collected yet
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {emails.map((entry) => (
                <div
                  key={entry._id}
                  className="flex px-[15px] w-full justify-between items-center bg-white border-b border-[#F3F4F6] pb-3"
                >
                  <div className="flex flex-col lg:flex-row w-full lg:justify-between lg:items-start gap-2 lg:gap-0">
                    <div className="flex items-center lg:w-[168px] px-[2px] gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#E3494E] flex items-center justify-center shrink-0">
                        <p className="text-white text-xs font-dm-sans-500 font-medium">
                          {entry.name?.charAt(0)?.toUpperCase() || "?"}
                        </p>
                      </div>
                      <p className="text-[#2D2D2D] font-medium text-xs leading-[14px] font-dm-sans-500">
                        {entry.name}
                      </p>
                    </div>
                    <div className="flex items-center lg:w-[201px] px-[2px]">
                      <p className="text-[#2D2D2D] font-medium text-xs leading-[14px] font-dm-sans-500 truncate">
                        {entry.email}
                      </p>
                    </div>
                    <div className="flex items-center lg:w-[143px] px-[2px]">
                      <p className="text-[#717182] font-medium text-xs leading-[14px] font-dm-sans-500">
                        {entry.location || "—"}
                      </p>
                    </div>
                    <div className="flex items-center lg:w-[98px] px-[2px]">
                      <button
                        onClick={() => handleDelete(entry._id)}
                        disabled={isDeleting === entry._id}
                        className="cursor-pointer disabled:opacity-50"
                      >
                        {isDeleting === entry._id ? (
                          <div className="w-4 h-4 rounded-full border-2 border-[#C10007] border-t-transparent animate-spin" />
                        ) : (
                          <img src="/delete.svg" alt="Delete" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EasyMedia;
