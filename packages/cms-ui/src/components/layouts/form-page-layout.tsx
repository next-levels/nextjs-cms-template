import { Card, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { Icons } from "../icons";

type FormPageLayoutProps = {
  title?: string;
  description?: string;
  children: React.ReactNode;
  backUrl?: string;
};

function FormPageLayout({
  title,
  description,
  children,
  backUrl,
}: FormPageLayoutProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-start gap-4">
        {backUrl && (
          <Link href={backUrl}>
            <Button variant="ghost">
              <Icons.chevronLeft className="size-8" />
            </Button>
          </Link>
        )}

        <div>
          {title && (
            <h1>
              <span className="text-3xl font-bold tracking-tight">{title}</span>
            </h1>
          )}
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>{children}</CardHeader>
      </Card>
    </div>
  );
}

FormPageLayout.displayName = "FormPageLayout";

export { FormPageLayout };
