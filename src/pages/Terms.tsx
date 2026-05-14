import { Gavel, AlertTriangle, Scale, Clock } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-background py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="space-y-8">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <Gavel className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
              <p className="text-muted-foreground">Last updated: May 8, 2026</p>
            </div>
          </div>

          <section className="space-y-4 text-muted-foreground leading-relaxed">
            <h2 className="text-2xl font-bold text-foreground">1. Acceptance of Terms</h2>
            <p>
              By accessing Techendy, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section className="space-y-4 text-muted-foreground leading-relaxed">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              2. Use License
            </h2>
            <p>
              Permission is granted to temporarily download one copy of the materials (information or software) on Techendy's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
            </p>
          </section>

          <section className="space-y-4 text-muted-foreground leading-relaxed">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              3. Disclaimer
            </h2>
            <p>
              The materials on Techendy's website are provided on an 'as is' basis. Techendy makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section className="space-y-4 text-muted-foreground leading-relaxed">
            <h2 className="text-2xl font-bold text-foreground">4. User Comments</h2>
            <p>
              Techendy does not filter, edit, publish or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of Techendy, its agents and/or affiliates. Comments reflect the views and opinions of the person who posts their views and opinions.
            </p>
          </section>

          <section className="space-y-4 text-muted-foreground leading-relaxed">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              5. Governing Law
            </h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of the cloud and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
