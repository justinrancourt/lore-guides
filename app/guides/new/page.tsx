import Link from "next/link";
import { NavBar } from "@/components/primitives/NavBar";
import { NewGuideForm } from "./NewGuideForm";

export default function NewGuidePage() {
  return (
    <div className="form-column">
      <NavBar
        sticky
        left={
          <Link href="/home/guides" className="font-serif text-[14px] text-faint">
            ✕ Cancel
          </Link>
        }
        center={
          <span
            className="font-serif text-[10px] uppercase text-faint"
            style={{ letterSpacing: "0.14em" }}
          >
            New guide
          </span>
        }
      />
      <NewGuideForm />
    </div>
  );
}
