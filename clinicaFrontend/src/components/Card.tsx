type CardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
};

export default function Card({ title, value, subtitle }: CardProps) {
  return (
    <div className="dashboard-card">
      <p className="card-title">{title}</p>
      <h2 className="card-value">{value}</h2>
      {subtitle && <span className="card-subtitle">{subtitle}</span>}
    </div>
  );
}