async function streamToFile(stream: ReadableStream<Uint8Array>, filename: string): Promise<File> {
    const blob = await new Response(stream).blob();
    return new File([blob], filename);
}

export default streamToFile;