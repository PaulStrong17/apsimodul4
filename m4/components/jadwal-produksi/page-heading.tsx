export function SchedulePageHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="relative z-10">
      <h1 className="text-[22px] font-bold leading-[1.3] text-[#17263b] md:text-[28px]">
        {title}
      </h1>
      <p className="mt-2 text-[14px] leading-[1.5] text-[#61738a] md:text-[17px]">
        {description}
      </p>
    </div>
  );
}
