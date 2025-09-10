import Image from "next/image";
import Graph from "./components/Graph";

export default function Home() {
  return (
    <div className="flex h-screen">
      <Graph />
    </div>
  );
}
