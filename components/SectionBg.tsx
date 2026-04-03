import Image from "next/image";

interface Props {
  position?: string;
}

export default function SectionBg({ position = "center" }: Props) {
  return (
    <>
      <Image
        src="/bg-space.jpg"
        alt=""
        fill
        className={`pointer-events-none object-cover opacity-30 blur-[2px]`}
        style={{ objectPosition: position }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-gray-950/70 via-gray-950/50 to-gray-950/70" />
    </>
  );
}
