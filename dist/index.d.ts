/// <reference types="node" />
export default function brDecode(): {
    name: string;
    decode(stream: NodeJS.ReadableStream): NodeJS.ReadableStream;
};
export { brDecode };
