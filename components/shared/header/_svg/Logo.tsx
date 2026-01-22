import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src="/logo.png"
      alt="Company Logo"
      width={70}   // adjust if needed
      height={25}   // adjust if needed
      priority
    />
  );
}
