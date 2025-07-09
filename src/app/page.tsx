import Link from "next/link";
export default function Home() {
  return (
    <div>
      <h1>Welcome to the Portfolio </h1>
      <Link href="/dashboard">Dashboard</Link>
    </div>
  );
}
