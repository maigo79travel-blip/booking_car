"use client";

import React, { useState } from "react";
import { Settings, Save, RefreshCw, Key, Code } from "lucide-react";

interface ContentManagerProps {
  content: any[];
  onSaveContent: (id: string, data: any) => Promise<void>;
}

export default function ContentManager({
  content,
  onSaveContent,
}: ContentManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftValues, setDraftValues] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleTextChange = (id: string, val: string) => {
    setDraftValues((prev) => ({ ...prev, [id]: val }));
  };

  const handleSave = async (id: string, rawVal: string) => {
    setIsSaving(true);
    try {
      const parsed = JSON.parse(rawVal);
      await onSaveContent(id, { value: parsed });
      alert("Đã lưu cấu hình thành công!");
    } catch (err: any) {
      alert("Dữ liệu JSON không hợp lệ: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-800">
          Cấu Hình Nội Dung Website ({content.length})
        </h1>
        <p className="text-xs md:text-sm text-gray-500">
          Quản lý các khối nội dung tĩnh, thanh điều hướng và thông tin liên hệ toàn website
        </p>
      </div>

      {/* Content list */}
      <div className="space-y-4">
        {content.map((item) => {
          const currentStr =
            draftValues[item.id] !== undefined
              ? draftValues[item.id]
              : JSON.stringify(item.value, null, 2);

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Key size={16} className="text-blue-600" />
                  <h3 className="font-extrabold text-gray-900 text-sm md:text-base font-mono">
                    {item.content_key}
                  </h3>
                  <span className="text-[10px] uppercase font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                    {item.content_type || "json"}
                  </span>
                </div>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => handleSave(item.id, currentStr)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <Save size={14} />
                  <span>{isSaving ? "Đang lưu..." : "Lưu thay đổi"}</span>
                </button>
              </div>

              <div>
                <textarea
                  rows={8}
                  value={currentStr}
                  onChange={(e) => handleTextChange(item.id, e.target.value)}
                  className="w-full p-3.5 bg-gray-50 text-gray-800 font-mono text-xs rounded-xl border border-gray-200 outline-none focus:bg-white focus:border-blue-500 transition-colors leading-relaxed"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
