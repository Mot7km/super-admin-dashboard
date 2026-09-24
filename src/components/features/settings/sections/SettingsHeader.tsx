type SettingsHeaderProps = {
  title: string;
  subtitle: string;
};

const SettingsHeader = ({ title, subtitle }: SettingsHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">{title}</h1>
        <p className="mt-1 text-xs text-[var(--text-muted)] sm:text-sm">{subtitle}</p>
      </div>
    </div>
  );
};

export default SettingsHeader;