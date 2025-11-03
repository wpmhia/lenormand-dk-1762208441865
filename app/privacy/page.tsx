import { Shield, Lock, Eye, Database } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PrivacyPage() {
  return (
    <div className="page-layout mystical-bg">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-foreground flex items-center justify-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-lg">
            Your privacy is sacred. We protect your data as carefully as we protect the cards.
          </p>
        </div>

        <div className="space-y-8">
          <Card className="border-border bg-muted">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary/80" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="text-foreground space-y-4">
              <p>
                We collect minimal information necessary to provide our divination services:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Reading questions and card selections (stored locally in your browser)</li>
                <li>Optional AI analysis requests (processed securely, not stored permanently)</li>
                <li>Basic usage analytics to improve our service</li>
              </ul>
              <p className="text-muted-foreground text-sm">
                <strong>Important:</strong> Your readings are private and stored only on your device unless you choose to share them.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-muted">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary/80" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="text-foreground space-y-4">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>To generate personalized Lenormand readings</li>
                <li>To provide AI-powered interpretations when requested</li>
                <li>To improve our services and user experience</li>
                <li>To ensure platform security and prevent abuse</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border bg-muted">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Database className="w-5 h-5 text-primary/80" />
                Data Storage & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="text-foreground space-y-4">
              <p>
                Your privacy is protected through multiple layers:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Local Storage:</strong> Readings are stored in your browser only</li>
                <li><strong>No Accounts Required:</strong> We don&apos;t collect personal identifiers</li>
                <li><strong>Secure AI Processing:</strong> AI requests are encrypted and not logged</li>
                <li><strong>No Data Selling:</strong> We never sell or share your data with third parties</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border bg-muted">
            <CardHeader>
              <CardTitle className="text-white">Your Rights</CardTitle>
            </CardHeader>
            <CardContent className="text-foreground space-y-4">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access: View all data stored in your browser</li>
                <li>Deletion: Clear your browser data to remove all readings</li>
                <li>Portability: Export your readings at any time</li>
                <li>Opt-out: Disable AI features if preferred</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border bg-muted">
            <CardHeader>
              <CardTitle className="text-white">Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="text-foreground space-y-4">
              <p>
                If you have questions about this privacy policy or how we handle your data, please reach out. We&apos;re committed to protecting your privacy and ensuring transparency in our practices.
              </p>
              <p className="text-muted-foreground text-sm">
                This policy is effective as of November 2024 and may be updated to reflect changes in our practices or legal requirements.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}