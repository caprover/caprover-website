import type { Metadata } from "next";
import Home from "../page";

export const metadata: Metadata = {
  alternates: { canonical: "https://caprover.com/" },
  robots: { index: false, follow: true },
};

export default Home;
