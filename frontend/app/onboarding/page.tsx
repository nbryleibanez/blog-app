import OnboardingForm from "@/components/auth/onboarding-form";
import {
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";

export const metadata = {
  title: "Onboarding"
}

export default async function OnboardingPage() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div>
            <h1 className="text-3xl font-bold">Let&apos;s get you started</h1>
          </div>
        </CardHeader>
        <CardContent>
          <OnboardingForm />
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </main>
  );
}
