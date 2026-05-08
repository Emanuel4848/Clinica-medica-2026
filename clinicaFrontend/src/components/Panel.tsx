type PanelProps = {
  title?: string;
  children: React.ReactNode;
};

export default function Panel({ title, children }: PanelProps) {
  return (
    <section className="panel-card">
      {title && <h2>{title}</h2>}
      {children}
    </section>
  );
}