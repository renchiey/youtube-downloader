import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();
  return <p>Link: {router.query.link}</p>;
}
