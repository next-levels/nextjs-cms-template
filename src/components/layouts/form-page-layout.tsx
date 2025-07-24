import { Card, CardHeader } from "~/components/ui/card";
import { TextGenerateEffect } from "../ui/text-generate-effect";
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
              <TextGenerateEffect
                className="text-3xl font-bold tracking-tight"
                words={title}
              />
            </h1>
          )}
          {description && (
            <TextGenerateEffect
              className="text-muted-foreground"
              words={description}
            />
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

export default FormPageLayout;
