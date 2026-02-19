import {
  ArrowRight,
  BriefcaseIcon,
  Search,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-background w-full max-w-full">
      
      {/* Background Gradient Glow (FIXED) */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 
                        w-[600px] h-[600px] max-w-[90vw] 
                        bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm bg-muted/50 backdrop-blur">
              <TrendingUp size={14} className="text-blue-600" />
              <span className="font-medium">
                India’s fastest-growing AI job platform
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              Find your next
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {" "}
                dream job
              </span>
              <br />
              with JobJet
            </h1>

            {/* Description */}
            <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
              Search top opportunities, enhance your resume with AI,
              check ATS compatibility, and get personalized career guidance —
              all in one intelligent platform.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/jobs">
                <Button
                  size="lg"
                  className="gap-2 px-8 h-12 text-base group"
                >
                  <Search size={18} />
                  Browse Jobs
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Button>
              </Link>

              <Link href="/resume-enhancer">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 px-8 h-12 text-base"
                >
                  <BriefcaseIcon size={18} />
                  Enhance Resume
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-10 pt-8">
              <Stat value="10k+" label="Active Jobs" />
              <Stat value="5k+" label="Companies" />
              <Stat value="50k+" label="Professionals" />
            </div>
          </div>

          {/* Right Image */}
          <div className="relative w-full">
            <div className="relative rounded-3xl overflow-hidden border shadow-xl">
              <Image
                src="/hero.jpeg"
                alt="Job search dashboard preview"
                width={800}
                height={600}
                className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
                priority
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

/* ---------- Stat Component ---------- */

const Stat = ({
  value,
  label,
}: {
  value: string;
  label: string;
}) => (
  <div>
    <p className="text-3xl font-bold text-blue-600">{value}</p>
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
);

export default Hero;
