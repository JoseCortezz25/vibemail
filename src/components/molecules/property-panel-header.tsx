interface PropertyPanelHeaderProps {
  title: string;
}

export function PropertyPanelHeader({ title }: PropertyPanelHeaderProps) {
  return (
    <div className="border-border border-b px-6 py-3.5">
      <h2 className="text-lg font-medium">{title}</h2>
    </div>
  );
}
