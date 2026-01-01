import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, GitBranch, Globe, LayoutDashboard, Mail, Workflow } from "lucide-react"

const services = [
  {
    title: "CRM Architecture",
    description: "HubSpot & Salesforce implementation tailored to your sales process.",
    icon: Database,
  },
  {
    title: "Lead Gen Pipelines",
    description: "Automated capture, enrichment, and routing of leads from any source.",
    icon: GitBranch,
  },
  {
    title: "Workflow Automation",
    description: "Connect apps with n8n, Make, or Zapier to eliminate manual tasks.",
    icon: Workflow,
  },
  {
    title: "Email Marketing",
    description: "High-deliverability sequences and behavioral triggers.",
    icon: Mail,
  },
  {
    title: "Data Visualization",
    description: "Custom dashboards to track KPIs and ROI in real-time.",
    icon: LayoutDashboard,
  },
  {
    title: "Web Integration",
    description: "Seamless connection between your website and your tech stack.",
    icon: Globe,
  },
]

export function Services() {
  return (
    <section id="services" className="container py-24 md:py-32 px-4 md:px-6">
      <div className="flex flex-col items-center gap-4 text-center mb-16">
        <h2 className="font-heading text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Core Capabilities
        </h2>
        <p className="max-w-[700px] text-muted-foreground md:text-lg">
          End-to-end solutions designed to maximize efficiency and revenue.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <Card key={index} className="bg-card/50 backdrop-blur-sm border-muted transition-all hover:border-accent/50 hover:bg-card">
            <CardHeader>
              <service.icon className="h-10 w-10 text-accent mb-4" />
              <CardTitle>{service.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                {service.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
