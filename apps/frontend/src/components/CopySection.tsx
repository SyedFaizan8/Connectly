import { FaCopy as Copy } from "react-icons/fa";

const CopySection = ({ roomId }: { roomId: string }) => {

    const copyToClipboard = () => {
        navigator.clipboard.writeText(roomId).then(() => {
            alert("Room ID copied to clipboard!");
        }).catch(err => {
            console.error("Failed to copy: ", err);
        });
    }

    return (
        <div className="flex flex-col absolute text-white border border-white rounded p-2 left-8 bottom-24">
            <div className="text-base">Copy Room ID:</div>
            <hr className="my-1" />
            <div className="flex items-center text-sm">
                <span >{roomId}</span>
                <Copy onClick={copyToClipboard} className="ml-3 cursor-pointer" />
            </div>
        </div>
    )
}

export default CopySection;