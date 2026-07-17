type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  id?: string;
  inverted?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  id,
  inverted = false,
}: SectionHeadingProps) {
  const alignment =
    align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={`flex max-w-2xl flex-col gap-4 ${alignment}`}>
      <p
        className={`text-xs font-semibold uppercase tracking-[0.22em] ${
          inverted ? "text-lime" : "text-accent"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        id={id}
        className={`text-3xl font-semibold leading-[1.08] tracking-[-0.035em] sm:text-4xl lg:text-5xl ${
          inverted ? "text-white" : "text-foreground"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`text-base leading-relaxed sm:text-lg ${
            inverted ? "text-dark-muted" : "text-muted"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
