interface OptionCardProps {
  title: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
  badge?: string;
  tooltip?: string;
  meta?: string[];
}

export function OptionCard({
  title,
  description,
  selected,
  onSelect,
  badge,
  tooltip,
  meta,
}: OptionCardProps) {
  return (
    <button
      type="button"
      className={`option-card${selected ? " option-card--selected" : ""}`}
      onClick={onSelect}
      aria-pressed={selected}
      title={tooltip}
    >
      <div className="option-card__header">
        <strong>{title}</strong>
        {badge ? <span className="option-card__badge">{badge}</span> : null}
      </div>
      <p>{description}</p>
      {tooltip ? <p className="option-card__tooltip">{tooltip}</p> : null}
      {meta && meta.length > 0 ? (
        <ul className="option-card__meta">
          {meta.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
    </button>
  );
}
