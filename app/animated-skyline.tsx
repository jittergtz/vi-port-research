import "./animated-skyline.css";
import { Skyline } from "./skyline";

export function AnimatedSkyline({ monochrome = false }: { monochrome?: boolean }) {
  return (
    <div className="animated-skyline" data-monochrome={monochrome || undefined}>
      <Skyline />
      <div className="animated-skyline-wash">
        <Skyline />
      </div>
    </div>
  );
}
