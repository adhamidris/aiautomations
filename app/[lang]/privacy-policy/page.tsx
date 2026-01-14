import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-24 md:px-6 lg:py-32 flex-grow max-w-4xl">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">
          Privacy Policy
        </h1>
        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              At Autom8ed, we respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website or use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may collect personal information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc pl-6 mt-2 text-muted-foreground space-y-2">
              <li>Contact us via our website or customer service channels.</li>
              <li>Sign up for our newsletter or updates.</li>
              <li>Purchase services or products.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              The types of information we may collect include your name, email address, phone number, and any other information you choose to provide.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 mt-2 text-muted-foreground space-y-2">
              <li>Provide, operate, and maintain our services.</li>
              <li>Improve, personalize, and expand our services.</li>
              <li>Communicate with you, including for customer service, updates, and marketing.</li>
              <li>Process transactions and manage your orders.</li>
            </ul>
          </section>

          <section className="bg-muted/30 p-6 rounded-lg border border-primary/10">
            <h2 className="text-xl font-semibold mb-4 text-primary">Meta & Instagram Automation</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our services may utilize a <strong>Meta Customer Service Bot</strong> to assist with inquiries. We explicitly clarify that:
            </p>
             <ul className="list-disc pl-6 mt-2 text-muted-foreground space-y-2">
              <li>The Meta/Instagram bot <strong>does not store or use any personal data</strong> for purposes outside of handling internal customer service procedures.</li>
              <li>Data processed by the bot is strictly limited to necessary business operations such as reviewing orders, checking policies, processing refunds, and answering specific evaluations or inquiries.</li>
              <li>No data collected via these automated interactions is sold, shared with third parties for marketing purposes, or used for profiling outside the context of your direct service request.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We presume standard security measures to protect your personal information. However, please be aware that no method of transmission over the internet or method of electronic storage is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us through our website contact form.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
