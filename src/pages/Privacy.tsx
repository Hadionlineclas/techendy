import { Shield, Lock, Eye, FileText } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="space-y-8">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-16 w-16 bg-stone-100 rounded-2xl flex items-center justify-center text-black">
              <Shield className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl md:text-6xl serif italic leading-none mb-2">Privacy Directive.</h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Techendy Legal Compliance • 2026</p>
            </div>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              1. Information We Collect
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              At Techendy, we prioritize transparency. We collect information you provide directly to us when you create an account, leave comments, or subscribe to our newsletter. This includes your name, email address, and profile photo provided via Google Authentication.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              2. How We Use Your Information
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We use the collected data to personalize your experience, provide customer support, and send you relevant AI insights. We do not sell your personal data to third parties. Our AI diagnostics tools may analyze anonymized usage patterns to improve site performance.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              3. Cookies and Tracking
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Techendy uses cookies to remember your preferences and analyze site traffic. You can control cookie settings through your browser. Deleting cookies may affect the functionality of certain site features.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">4. Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement industry-standard security measures, including advanced encryption protocols, to protect your data. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <div className="pt-12 border-t text-sm text-muted-foreground italic">
            For any questions regarding this policy, please contact us at privacy@techendy.ai
          </div>
        </div>
      </div>
    </div>
  );
}
