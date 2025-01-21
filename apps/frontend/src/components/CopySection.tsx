import { useState } from "react";
import { FaCopy as Copy } from "react-icons/fa";

const CopySection = ({ roomId }: { roomId: string }) => {
    const [copied, setCopied] = useState<boolean>();

    const copyToClipboard = () => {
        navigator.clipboard.writeText(roomId).then(() => {
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 5000)
        }).catch(err => {
            console.error("Failed to copy: ", err);
        });
    }

    return (
        <div className="flex flex-col absolute text-white border border-white rounded p-2 left-8 bottom-24">
            <div className="text-base">{!copied ? "Copy Room ID:" : "Room ID Copied"}</div>
            <hr className="my-1" />
            <div className="flex items-center text-sm">
                <span >{roomId}</span>
                <Copy onClick={copyToClipboard} className="ml-3 cursor-pointer" />
            </div>
        </div>
    )
}

export default CopySection;