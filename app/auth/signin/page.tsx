import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Please sign in to your account.</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Add sign-in form elements here later */}
        <Button>Sign In</Button>
      </CardContent>
    </Card>
  );
}
