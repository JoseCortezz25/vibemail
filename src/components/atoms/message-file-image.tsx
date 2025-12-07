interface MessageFileImageProps {
  mimeType: string;
  data: string;
}

export function MessageFileImage({ mimeType, data }: MessageFileImageProps) {
  return (
    <img
      src={`data:${mimeType};base64,${data}`}
      alt={mimeType}
      className="rounded-md"
    />
  );
}
