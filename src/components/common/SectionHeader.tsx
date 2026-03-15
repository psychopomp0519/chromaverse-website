interface SectionHeaderProps {
  title: string;
  kanji?: string;
  subtitle?: string;
  description?: string;
}

export function SectionHeader({ title, kanji, subtitle, description }: SectionHeaderProps) {
  return (
    <div className="mb-12">
      {kanji && (
        <p className="text-sm font-medium tracking-[0.3em] uppercase text-(--color-text-muted)">
          {kanji}
        </p>
      )}
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl md:text-5xl font-(family-name:--font-heading)">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-lg text-(--color-text-secondary)">{subtitle}</p>
      )}
      {description && (
        <p className="mt-4 max-w-2xl text-(--color-text-secondary) leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
