import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <form>
        <label className="m-2">
          <span>Country:</span>
        </label>
        <input type="text" name="country" />

      </form>



    </main>
  );
}
