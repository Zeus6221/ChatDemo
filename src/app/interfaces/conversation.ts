import { FileMessage } from "./file-message";

export interface Conversation {
    Seen: boolean;
    Timestamp: number;
    Uid: string;
    TextMessage: string;
    Receiver: string;
    Sender: string;
    Type: string;
    AttachFile?: Array<FileMessage>;
}
