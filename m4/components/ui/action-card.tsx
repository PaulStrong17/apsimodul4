import Image from "next/image";
import Link from "next/link";

type ActionCardProps = {
  title: string;
  description: string;
  icon: string;
  href?: string;
};

const actionCardClassName =
  "flex min-h-[clamp(164px,15.84vw,228px)] w-full flex-col items-start gap-4 rounded-[14px] border border-[#d6e3ed] bg-[rgba(255,255,255,0.31)] p-[clamp(16px,1.67vw,24px)] text-left shadow-[-4px_7px_12.2px_0px_rgba(0,0,0,0.55)] transition-colors hover:bg-white/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a3d62]";

function ActionCardContent({
  title,
  description,
  icon,
}: Omit<ActionCardProps, "href">) {
  return (
    <>
      <span className="flex w-full items-center gap-[14px]">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#ecf6fd]">
          <Image src={icon} alt="" width={20} height={20} />
        </span>
        <span className="text-[clamp(16px,1.53vw,22px)] font-bold leading-normal text-[#17263b]">
          {title}
        </span>
      </span>
      <span className="text-[clamp(13px,1.18vw,17px)] leading-[1.5] text-[#61738a]">
        {description}
      </span>
    </>
  );
}

export function ActionCard({
  title,
  description,
  icon,
  href,
}: ActionCardProps) {
  const content = (
    <ActionCardContent title={title} description={description} icon={icon} />
  );

  if (href) {
    return (
      <Link href={href} className={actionCardClassName}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={actionCardClassName}>
      {content}
    </button>
  );
}
